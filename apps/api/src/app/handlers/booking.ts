import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInMinutes,
  getISODay,
  isAfter,
  setMinutes,
  startOfDay
} from 'date-fns';
import { send } from 'micro';
import { get, post, put, AugmentedRequestHandler } from 'microrouter';
import { times } from 'ramda';
import * as Stripe from 'stripe';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
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
import { requireBooking } from '../helpers/booking';

const getBooking: AugmentedRequestHandler = async (req, res) => {
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await BookingModel.findById(bookingId).populate('escapeRoom');

  if (!booking) {
    return send(res, STATUS_ERROR.NOT_FOUND);
  }

  return send(res, STATUS_SUCCESS.OK, booking);
};

const listBookings: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);

  const organization = await requireEscapeRoom(escapeRoomId);
  await requireBelongsToOrganization(organization.id, userId);

  const bookings = await BookingModel.find({
    escapeRoom: escapeRoomId,
    endDate: { $gt: new Date() }
  });

  return send(res, STATUS_SUCCESS.OK, bookings);
};

const createBooking: AugmentedRequestHandler = async (req, res) => {
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  const dto = await getBody(req, CreateBookingDTO);

  const escapeRoom = await requireEscapeRoom(escapeRoomId);

  const invalidInterval =
    differenceInMinutes(dto.endDate, dto.startDate) !== escapeRoom.interval;
  const invalidParticipants = !isBetween(
    dto.participants,
    escapeRoom.participants
  );

  // TODO: validate if starts at timeslot start
  if (invalidInterval || invalidParticipants) {
    return send(res, STATUS_ERROR.BAD_REQUEST);
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
    return send(
      res,
      STATUS_ERROR.BAD_REQUEST,
      'A booking already exists at this time'
    );
  }

  const bookingFields: BookingInitFields = {
    ...dto,
    escapeRoom: escapeRoomId,
    status: BookingStatus.Pending
  };

  if (escapeRoom.paymentEnabled) {
    if (!dto.paymentToken) {
      return send(res, STATUS_ERROR.BAD_REQUEST, 'Missing payment token');
    }

    const organization = await requireOrganization(escapeRoom.organization);

    if (!organization.paymentDetails) {
      return send(
        res,
        STATUS_ERROR.BAD_REQUEST,
        'Payments not enabled for this escape room'
      );
    }

    const stripe = new Stripe(organization.paymentDetails.paymentSecretKey);

    await stripe.charges.create({
      amount:
        (escapeRoom.pricingType === PricingType.FLAT
          ? escapeRoom.price
          : dto.participants * escapeRoom.price) * 100,
      currency: 'eur',
      description: 'Example charge', // TODO: give proper name
      source: dto.paymentToken
    });

    bookingFields.status = BookingStatus.Accepted;
  }

  const booking = await BookingModel.create(bookingFields);

  return send(res, STATUS_SUCCESS.OK, booking);
};

const getAvailability: AugmentedRequestHandler = async (req, res) => {
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  const { from, to } = getQuery(req, ['from', 'to']);

  const dateNow = new Date();
  const fromDay = startOfDay(new Date(from));
  const toDay = startOfDay(new Date(to));

  if (differenceInCalendarDays(toDay, fromDay) > 35) {
    return send(res, STATUS_ERROR.BAD_REQUEST, 'Date range is too big');
  }

  const escapeRoom = await requireEscapeRoom(escapeRoomId);
  const activeBookings = await BookingModel.find({
    escapeRoom: escapeRoomId,
    endDate: { $gt: fromDay },
    startDate: { $gt: toDay },
    status: BookingStatus.Accepted
  });

  const availability = times(day => {
    const date = addDays(fromDay, day);
    const dayOfweek = getISODay(date);
    const businessHours = escapeRoom.businessHours.find(
      ({ weekday }) => weekday === dayOfweek
    );

    if (date < startOfDay(dateNow) || !businessHours) {
      return null;
    }

    const [startHour, endHour] = businessHours.hours;

    // TODO: calculations may be using local timezone, should use escapeRoom's
    const timeslots = times(i => {
      const start = setMinutes(date, startHour * 60 + i * escapeRoom.interval);
      const end = setMinutes(
        date,
        startHour * 60 + (i + 1) * escapeRoom.interval
      );
      return { start, end };
    }, ((endHour - startHour) * 60) / escapeRoom.interval);

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

  return send(res, STATUS_SUCCESS.OK, availability);
};

const rejectBooking: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await requireBooking(bookingId);
  const escapeRoom = await requireEscapeRoom(booking.escapeRoom);
  await requireBelongsToOrganization(escapeRoom.organization, userId);

  if (booking.status !== BookingStatus.Pending) {
    return send(
      res,
      STATUS_ERROR.BAD_REQUEST,
      'Only pending booking can be rejected'
    );
  }

  booking.status = BookingStatus.Rejected;
  const savedBooking = await booking.save();

  // TODO: send email

  return send(res, STATUS_SUCCESS.OK, savedBooking);
};

const acceptBooking: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { bookingId } = getParams(req, ['bookingId']);

  const booking = await requireBooking(bookingId);
  const escapeRoom = await requireEscapeRoom(booking.escapeRoom);
  await requireBelongsToOrganization(escapeRoom.organization, userId);

  if (booking.status !== BookingStatus.Pending) {
    return send(res, STATUS_ERROR.BAD_REQUEST);
  }

  booking.status = BookingStatus.Accepted;
  const savedBooking = await booking.save();

  // TODO: send email

  return send(res, STATUS_SUCCESS.OK, savedBooking);
};

export const bookingHandlers = [
  post('/escape-room/:escapeRoomId/booking', createBooking),
  get('/escape-room/:escapeRoomId/booking', listBookings),
  get('/escape-room/:escapeRoomId/availability', getAvailability),
  get('/booking/:bookingId', getBooking),
  put('/booking/:bookingId/reject', rejectBooking),
  put('/booking/:bookingId/accept', acceptBooking)
];
