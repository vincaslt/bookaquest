import Axios from 'axios';
import {
  BookingDTO,
  BookingWithEscapeRoomDTO,
  CreateBooking,
  EscapeRoomDTO,
  fromBookingWithEscapeRoomDTO,
  fromEscapeRoomDTO,
  fromOrganizationDTO,
  OrganizationDTO,
  toCreateBookingDTO,
  fromBookingDTO,
  AvailabilityDTO,
  fromAvailabilityDTO
} from '@bookaquest/interfaces';
import { environment } from '../../environments/environment';

const api = Axios.create({
  baseURL: environment.backendUrl
});

export const getOrganization = (organizationId: string) =>
  api
    .get<OrganizationDTO>(`/organization/${organizationId}`)
    .then(res => res.data)
    .then(fromOrganizationDTO);

export const getEscapeRooms = (organizationId: string) =>
  api
    .get<EscapeRoomDTO[]>(`/organization/${organizationId}/escape-room`)
    .then(res => res.data.map(fromEscapeRoomDTO));

export const getEscapeRoom = (escapeRoomId: string) =>
  api
    .get<EscapeRoomDTO>(`/escape-room/${escapeRoomId}`)
    .then(res => res.data)
    .then(fromEscapeRoomDTO);

export const getBooking = (bookingId: string) =>
  api
    .get<BookingWithEscapeRoomDTO>(`/booking/${bookingId}`)
    .then(res => res.data)
    .then(fromBookingWithEscapeRoomDTO);

export const createBooking = (booking: CreateBooking) =>
  api
    .post<BookingDTO>(
      `/escape-room/${booking.escapeRoomId}/booking`,
      toCreateBookingDTO(booking)
    )
    .then(res => res.data)
    .then(fromBookingDTO);

export const getAvailability = (escapeRoomId: string, from: Date, to: Date) =>
  api
    .get<AvailabilityDTO>(`escape-room/${escapeRoomId}/availability`, {
      params: { from, to }
    })
    .then(res => res.data)
    .then(fromAvailabilityDTO);
