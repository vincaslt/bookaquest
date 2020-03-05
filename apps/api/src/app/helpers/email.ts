import { send, setApiKey } from '@sendgrid/mail';
import { format, utcToZonedTime } from 'date-fns-tz';
import { isSameDay } from 'date-fns';
import { DocumentType } from '@typegoose/typegoose';
import { formatCurrency } from '@bookaquest/utilities';
import { Booking } from '../models/Booking';
import { EscapeRoom } from '../models/EscapeRoom';
import { environment } from '../../environments/environment';
import { OrganizationMembership } from '../models/OrganizationMembership';
import { User } from '../models/User';

const emails = {
  info: { name: 'BookaQuest', email: 'info@bookaquest.com' }
};

export function initEmail() {
  if (process.env.SENDGRID_API_KEY) {
    setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export function sendVerificationEmail(email: string, verificationCode: string) {
  return send({
    to: email,
    from: emails.info,
    templateId: 'd-63c2f9cf4bbf48a0839f648185f53d8b',
    dynamicTemplateData: {
      verificationUrl: `${environment.bookingManagerUrl}/?code=${verificationCode}`
    }
  });
}

// TODO: localize emails and dates
export function sendPlayerBookingRequestEmail(
  booking: DocumentType<Booking>,
  escapeRoom: DocumentType<EscapeRoom>
) {
  const adjustedStartDate = utcToZonedTime(
    booking.startDate,
    escapeRoom.timezone
  );
  const adjustedEndDate = utcToZonedTime(booking.endDate, escapeRoom.timezone);

  return send({
    to: booking.email,
    from: emails.info,
    templateId: 'd-72811a13a18d4ea28e9f84e83b12a798',
    dynamicTemplateData: {
      escapeRoomTitle: escapeRoom.name,
      escapeRoomImage: escapeRoom.images[0],
      date: `${format(adjustedStartDate, 'PPPp')} - ${format(
        adjustedEndDate,
        isSameDay(adjustedStartDate, adjustedEndDate) ? 'p' : 'PPPp'
      )}`,
      name: booking.name,
      participants: booking.participants,
      totalPrice: formatCurrency('en', booking.currency, booking.price), // TODO: dynamic locale
      itineraryUrl: `${environment.bookingAppUrl}/itinerary/${booking._id}`
    }
  });
}

export function sendPlayerBookingConfirmationEmail(
  booking: DocumentType<Booking>,
  escapeRoom: DocumentType<EscapeRoom>
) {
  const adjustedStartDate = utcToZonedTime(
    booking.startDate,
    escapeRoom.timezone
  );
  const adjustedEndDate = utcToZonedTime(booking.endDate, escapeRoom.timezone);

  return send({
    to: booking.email,
    from: emails.info,
    templateId: 'd-69a43ce1149a40b6abacea432fa8d891',
    dynamicTemplateData: {
      escapeRoomTitle: escapeRoom.name,
      escapeRoomImage: escapeRoom.images[0],
      date: `${format(adjustedStartDate, 'PPPp')} - ${format(
        adjustedEndDate,
        isSameDay(adjustedStartDate, adjustedEndDate) ? 'p' : 'PPPp'
      )}`,
      participants: booking.participants,
      totalPrice: formatCurrency('en', booking.currency, booking.price), // TODO: dynamic locale
      itineraryUrl: `${environment.bookingAppUrl}/itinerary/${booking._id}`
    }
  });
}

export function sendPlayerBookingRejectionEmail(
  booking: DocumentType<Booking>,
  escapeRoom: DocumentType<EscapeRoom>
) {
  const adjustedStartDate = utcToZonedTime(
    booking.startDate,
    escapeRoom.timezone
  );
  const adjustedEndDate = utcToZonedTime(booking.endDate, escapeRoom.timezone);

  return send({
    to: booking.email,
    from: emails.info,
    templateId: 'd-6d92e4cfffc0423092d992ff7450f85c',
    dynamicTemplateData: {
      escapeRoomTitle: escapeRoom.name,
      escapeRoomImage: escapeRoom.images[0],
      date: `${format(adjustedStartDate, 'PPPp')} - ${format(
        adjustedEndDate,
        isSameDay(adjustedStartDate, adjustedEndDate) ? 'p' : 'PPPp'
      )}`,
      participants: booking.participants,
      totalPrice: formatCurrency('en', booking.currency, booking.price), // TODO: dynamic locale
      itineraryUrl: `${environment.bookingAppUrl}/itinerary/${booking._id}`
    }
  });
}

export function sendOrganizationBookingRequestEmail(
  members: DocumentType<OrganizationMembership>[],
  booking: DocumentType<Booking>,
  escapeRoom: DocumentType<EscapeRoom>
) {
  const adjustedStartDate = utcToZonedTime(
    booking.startDate,
    escapeRoom.timezone
  );
  const adjustedEndDate = utcToZonedTime(booking.endDate, escapeRoom.timezone);

  return Promise.all(
    members.map(member =>
      send({
        to: (member.user as DocumentType<User>).email,
        from: emails.info,
        templateId: 'd-54aec4106fef41afa54e70d9bbb94101',
        dynamicTemplateData: {
          escapeRoomTitle: escapeRoom.name,
          escapeRoomImage: escapeRoom.images[0],
          date: `${format(adjustedStartDate, 'PPPp')} - ${format(
            adjustedEndDate,
            isSameDay(adjustedStartDate, adjustedEndDate) ? 'p' : 'PPPp'
          )}`,
          name: booking.name,
          participants: booking.participants,
          totalPrice: formatCurrency('en', booking.currency, booking.price),
          bookingUrl: `${environment.bookingManagerUrl}/booking/${booking._id}`,
          email: booking.email,
          phoneNumber: booking.phoneNumber
        }
      })
    )
  );
}
