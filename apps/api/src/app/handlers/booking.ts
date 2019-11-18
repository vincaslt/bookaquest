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
import { get, post, put } from 'microrouter';
import { times } from 'ramda';
import * as Stripe from 'stripe';
import { withParams } from '../lib/decorators/withParams';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { withBody } from '../lib/decorators/withBody';
import { CreateBookingDTO } from '../dto/CreateBookingDTO';
import { isBetween } from '../helpers/number';
import { withQuery } from '../lib/decorators/withQuery';
import { withAuth } from '../lib/decorators/withAuth';
import { isOrganizationMember } from '../helpers/organizationHelpers';
import {
  BookingModel,
  BookingInitFields,
  BookingStatus
} from '../models/Booking';
import { EscapeRoomModel, PricingType } from '../models/EscapeRoom';
import { OrganizationModel } from '../models/Organization';

const getBooking = withParams(
  ['bookingId'],
  ({ bookingId }) => async (req, res) => {
    const booking = await BookingModel.findById(bookingId).populate(
      'escapeRoom'
    );

    if (!booking) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    return send(res, STATUS_SUCCESS.OK, booking);
  }
);

const listBookings = withAuth(({ userId }) =>
  withParams(['escapeRoomId'], ({ escapeRoomId }) => async (req, res) => {
    const escapeRoom = await EscapeRoomModel.findById(escapeRoomId);

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const organization = await escapeRoom.getOrganization();

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const isMember = await isOrganizationMember(organization.id, userId);

    if (!isMember) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    }

    const bookings = await BookingModel.find({
      escapeRoom: escapeRoomId,
      endDate: { $gt: new Date() }
    });

    return send(res, STATUS_SUCCESS.OK, bookings);
  })
);

const createBooking = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withBody(CreateBookingDTO, dto => async (req, res) => {
    const escapeRoom = await EscapeRoomModel.findById(escapeRoomId);

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

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
      return send(res, STATUS_ERROR.BAD_REQUEST);
    }

    const bookingFields: BookingInitFields = {
      ...dto,
      escapeRoom: escapeRoomId,
      status: BookingStatus.Pending
    };

    if (escapeRoom.paymentEnabled) {
      if (!dto.paymentToken) {
        return send(res, STATUS_ERROR.BAD_REQUEST);
      }

      const organization = await escapeRoom.getOrganization();

      if (!organization?.paymentDetails) {
        return send(res, STATUS_ERROR.BAD_REQUEST);
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
  })
);

const getAvailability = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withQuery(['from', 'to'], ({ from, to }) => async (req, res) => {
    const dateNow = new Date();
    const fromDay = from && startOfDay(new Date(from));
    const toDay = to && startOfDay(new Date(to));

    if (!fromDay || !toDay || differenceInCalendarDays(toDay, fromDay) > 35) {
      return send(res, STATUS_ERROR.BAD_REQUEST);
    }

    const escapeRoom = await EscapeRoomModel.findById(escapeRoomId);

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

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
        const start = setMinutes(
          date,
          startHour * 60 + i * escapeRoom.interval
        );
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
  })
);

const rejectBooking = withAuth(({ userId }) =>
  withParams(['bookingId'], ({ bookingId }) => async (req, res) => {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const organization = await OrganizationModel.findOne({
      escapeRooms: booking.escapeRoom
    });

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const isMember = await isOrganizationMember(organization.id, userId);

    if (!isMember) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    }

    if (booking.status !== BookingStatus.Pending) {
      return send(res, STATUS_ERROR.BAD_REQUEST);
    }

    booking.status = BookingStatus.Rejected;
    const savedBooking = await booking.save();

    // TODO: send email

    return send(res, STATUS_SUCCESS.OK, savedBooking);
  })
);

const acceptBooking = withAuth(({ userId }) =>
  withParams(['bookingId'], ({ bookingId }) => async (req, res) => {
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const organization = await OrganizationModel.findOne({
      escapeRooms: booking.escapeRoom
    });

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const isMember = await isOrganizationMember(organization.id, userId);

    if (!isMember) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    }

    if (booking.status !== BookingStatus.Pending) {
      return send(res, STATUS_ERROR.BAD_REQUEST);
    }

    booking.status = BookingStatus.Accepted;
    const savedBooking = await booking.save();

    // TODO: send email

    return send(res, STATUS_SUCCESS.OK, savedBooking);
  })
);

export const bookingHandlers = [
  post('/escape-room/:escapeRoomId/booking', createBooking),
  get('/escape-room/:escapeRoomId/booking', listBookings),
  get('/escape-room/:escapeRoomId/availability', getAvailability),
  get('/booking/:bookingId', getBooking),
  put('/booking/:bookingId/reject', rejectBooking),
  put('/booking/:bookingId/accept', acceptBooking)
];
