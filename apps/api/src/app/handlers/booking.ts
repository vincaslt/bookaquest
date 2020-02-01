import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  isAfter,
  startOfDay,
  isEqual
} from 'date-fns';
import { createError } from 'micro';
import { get, post, put, AugmentedRequestHandler } from 'microrouter';
import { times } from 'ramda';
import * as Stripe from 'stripe';
import { STATUS_ERROR } from '../lib/constants';
import { CreateBookingDTO } from '../dto/CreateBookingDTO';
import { isBetween } from '../helpers/number';
import {
  BookingModel,
  BookingInitFields,
  BookingStatus
} from '../models/Booking';
import { PricingType } from '../models/EscapeRoom';
import {
  requireBelongsToOrganization,
  requireOrganization
} from '../helpers/organization';
import { getParams } from '../lib/utils/getParams';
import { getAuth } from '../lib/utils/getAuth';
import { getBody } from '../lib/utils/getBody';
import { requireEscapeRoom } from '../helpers/escapeRoom';
import { getQuery } from '../lib/utils/getQuery';
import { requireBooking, generateTimeslots } from '../helpers/booking';
import { sendBookingEmail } from '../helpers/email';

const MAX_DAYS_SELECT = 7 * 6;
const PAGINATION_LIMIT = 500;

const getBooking: AugmentedRequestHandler = async (req, res) => {
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await BookingModel.findById(bookingId).populate('escapeRoom');

  if (!booking) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Booking not found');
  }

  return booking;
};

const listBookings: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  const { from, to, offset, take } = getQuery(req, undefined, [
    'from',
    'to',
    'offset',
    'take'
  ]);

  const escapeRoom = await requireEscapeRoom(escapeRoomId);
  await requireBelongsToOrganization(escapeRoom.organization, userId);

  const fromDate = from ? new Date(from) : new Date();
  const toDate = to && new Date(to);

  if (
    !take &&
    toDate &&
    differenceInCalendarDays(toDate, fromDate) > MAX_DAYS_SELECT
  ) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'Date range is too big');
  }

  const skip = offset && !isNaN(+offset) ? +offset : 0;
  const limit = take && !isNaN(+take) ? +take : PAGINATION_LIMIT;

  const query = {
    escapeRoom: escapeRoomId,
    endDate: toDate ? { $gt: fromDate, $lt: toDate } : { $gt: fromDate }
  };
  const [bookings, total] = await Promise.all([
    BookingModel.find(query, null, {
      sort: { endDate: -1 },
      skip,
      limit
    }),
    BookingModel.count(query)
  ]);

  return { bookings, total };
};

const createBooking: AugmentedRequestHandler = async (req, res) => {
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  const dto = await getBody(req, CreateBookingDTO);

  const escapeRoom = await requireEscapeRoom(escapeRoomId);
  const timeslots = generateTimeslots(dto.startDate, escapeRoom);

  const invalidParticipants = !isBetween(
    dto.participants,
    escapeRoom.participants
  );
  const invalidTimeslot = timeslots.every(
    timeslot =>
      !isEqual(timeslot.start, dto.startDate) ||
      !isEqual(timeslot.end, dto.endDate)
  );

  if (invalidTimeslot || invalidParticipants) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'Booking has invalid timeslot or participants'
    );
  }

  const overlap = await BookingModel.findOne({
    escapeRoom: escapeRoomId,
    status: BookingStatus.Accepted,
    $or: [
      { startDate: { $gt: dto.startDate, $lt: dto.endDate } },
      { endDate: { $gt: dto.startDate, $lt: dto.endDate } }
    ]
  });

  if (overlap) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'A booking already exists at this time'
    );
  }

  const price =
    escapeRoom.pricingType === PricingType.FLAT
      ? escapeRoom.price
      : dto.participants * escapeRoom.price;

  const bookingFields: BookingInitFields = {
    ...dto,
    price,
    currency: escapeRoom.currency,
    escapeRoom: escapeRoomId,
    status: BookingStatus.Pending
  };

  if (escapeRoom.paymentEnabled) {
    if (!dto.paymentToken) {
      throw createError(STATUS_ERROR.BAD_REQUEST, 'Missing payment token');
    }

    const organization = await requireOrganization(escapeRoom.organization);

    if (!organization.paymentDetails) {
      throw createError(
        STATUS_ERROR.BAD_REQUEST,
        'Payments not enabled for this escape room'
      );
    }

    const stripe = new Stripe(organization.paymentDetails.paymentSecretKey);

    await stripe.charges.create({
      amount: price * 100,
      currency: 'eur', // TODO: dynamic currency
      description: `Payment to book ${escapeRoom.name}`,
      source: dto.paymentToken
    });

    bookingFields.status = BookingStatus.Accepted;
  }

  const booking = await BookingModel.create(bookingFields);

  // ! TODO: send email for members of organization?

  await sendBookingEmail(booking, escapeRoom);

  return booking;
};

const getAvailability: AugmentedRequestHandler = async (req, res) => {
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  const { from, to } = getQuery(req, ['from', 'to']);

  const dateNow = new Date();
  const fromDay = startOfDay(new Date(from));
  const toDay = startOfDay(new Date(to));

  if (differenceInCalendarDays(toDay, fromDay) > MAX_DAYS_SELECT) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'Date range is too big');
  }

  const escapeRoom = await requireEscapeRoom(escapeRoomId);
  const activeBookings = await BookingModel.find({
    escapeRoom: escapeRoomId,
    endDate: { $gt: fromDay },
    startDate: { $lt: toDay },
    status: BookingStatus.Accepted
  });

  const availability = times(day => {
    const date = addDays(fromDay, day);

    if (date < startOfDay(new Date())) {
      return { date, availableTimeslots: [] };
    }

    const timeslots = generateTimeslots(date, escapeRoom);

    const availableTimeslots = timeslots.filter(
      ({ start, end }) =>
        isAfter(start, dateNow) &&
        activeBookings.every(
          booking =>
            !areIntervalsOverlapping(
              { start, end },
              { start: booking.startDate, end: booking.endDate }
            )
        )
    );

    return { date, availableTimeslots };
  }, differenceInCalendarDays(toDay, fromDay)).filter(Boolean);

  return availability;
};

const rejectBooking: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await requireBooking(bookingId);
  const escapeRoom = await requireEscapeRoom(booking.escapeRoom);
  await requireBelongsToOrganization(escapeRoom.organization, userId);

  const isOutdated = isAfter(new Date(), booking.startDate);

  if (booking.status !== BookingStatus.Pending || isOutdated) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'Only pending booking can be rejected'
    );
  }

  booking.status = BookingStatus.Rejected;
  const savedBooking = await booking.save();

  // ! TODO: send email

  return [savedBooking];
};

const acceptBooking: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await requireBooking(bookingId);
  const escapeRoom = await requireEscapeRoom(booking.escapeRoom);
  await requireBelongsToOrganization(escapeRoom.organization, userId);

  const isOutdated = isAfter(new Date(), booking.startDate);

  if (booking.status !== BookingStatus.Pending || isOutdated) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'Only pending booking can be accepted'
    );
  }

  const sameTimeBookings = await BookingModel.find({
    _id: { $ne: booking.id },
    status: BookingStatus.Pending,
    startDate: booking.startDate
  });

  const updatedSameTimeBookings = await Promise.all(
    sameTimeBookings.map(sameTimeBooking => {
      sameTimeBooking.status = BookingStatus.Rejected;
      return sameTimeBooking.save();
    })
  );

  booking.status = BookingStatus.Accepted;
  const savedBooking = await booking.save();

  // ! TODO: send email

  return [savedBooking, ...updatedSameTimeBookings];
};

const cancelBooking: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await requireBooking(bookingId);
  const escapeRoom = await requireEscapeRoom(booking.escapeRoom);
  await requireBelongsToOrganization(escapeRoom.organization, userId);

  if (booking.status !== BookingStatus.Accepted) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'Only accepted booking can be canceled'
    );
  }

  booking.status = BookingStatus.Canceled;
  const savedBooking = await booking.save();

  // TODO: send email

  return [savedBooking];
};

export const bookingHandlers = [
  post('/escape-room/:escapeRoomId/booking', createBooking),
  get('/escape-room/:escapeRoomId/booking', listBookings),
  get('/escape-room/:escapeRoomId/availability', getAvailability),
  get('/booking/:bookingId', getBooking),
  put('/booking/:bookingId/reject', rejectBooking),
  put('/booking/:bookingId/accept', acceptBooking),
  put('/booking/:bookingId/cancel', cancelBooking)
];
