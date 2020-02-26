import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { startOfDay, addMinutes, getISODay } from 'date-fns';
import { DocumentType } from '@typegoose/typegoose';
import { createError } from 'micro';
import { times } from 'ramda';
import { BookingModel } from '../models/Booking';
import { STATUS_ERROR } from '../lib/constants';
import { EscapeRoom } from '../models/EscapeRoom';

export function generateTimeslots(
  date: Date,
  escapeRoom: DocumentType<EscapeRoom>
) {
  const timeZone = escapeRoom.timezone;
  const zoneDate = utcToZonedTime(date, timeZone); // zoned time, because work hours are in timezone
  const dayOfWeek = getISODay(zoneDate);

  const businessHours = escapeRoom.businessHours.find(
    ({ weekday }) => weekday === dayOfWeek
  );

  if (!businessHours) {
    return [];
  }

  const [startHour, endHour] = businessHours.hours;

  const timeslots = times(i => {
    const tzDate = zonedTimeToUtc(startOfDay(zoneDate), timeZone);
    const start = addMinutes(tzDate, startHour * 60 + i * escapeRoom.interval);
    const end = addMinutes(
      tzDate,
      startHour * 60 + (i + 1) * escapeRoom.interval
    );
    return { start, end };
  }, ((endHour - startHour) * 60) / escapeRoom.interval);

  return timeslots;
}

export async function requireBooking(bookingId: string) {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Booking not found');
  }
  return booking;
}
