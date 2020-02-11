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

enum Emails {
  Info = 'info@bookaquest.com'
}

export function initEmail() {
  if (process.env.SENDGRID_API_KEY) {
    setApiKey(process.env.SENDGRID_API_KEY);
  }
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
    from: Emails.Info,
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
        from: Emails.Info,
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
