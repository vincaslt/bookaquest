import Axios from 'axios'
import {
  CreateBooking,
  fromBookingDTO,
  fromBookingWithEscapeRoomDTO,
  toCreateBookingDTO
} from '../../../commons/interfaces/booking'
import { BookingDTO, BookingWithEscapeRoomDTO } from '../../../commons/interfaces/dto/booking'
import { EscapeRoomDTO } from '../../../commons/interfaces/dto/escapeRoom'
import { OrganizationDTO } from '../../../commons/interfaces/dto/organization'
import { TimeslotDTO } from '../../../commons/interfaces/dto/timeslot'
import { fromEscapeRoomDTO } from '../../../commons/interfaces/escapeRoom'
import { fromOrganizationDTO } from '../../../commons/interfaces/organization'
import { fromTimeslotDTO } from '../../../commons/interfaces/timeslot'

const api = Axios.create({
  baseURL: 'http://localhost:3001'
})

export const getOrganization = (organizationId: string) =>
  api
    .get<OrganizationDTO>(`/organization/${organizationId}`)
    .then(res => res.data)
    .then(fromOrganizationDTO)

export const getEscapeRooms = (organizationId: string) =>
  api
    .get<EscapeRoomDTO[]>(`/organization/${organizationId}/escape-room`)
    .then(res => res.data.map(fromEscapeRoomDTO))

export const getBooking = (bookingId: string) =>
  api
    .get<BookingWithEscapeRoomDTO>(`/booking/${bookingId}`)
    .then(res => res.data)
    .then(fromBookingWithEscapeRoomDTO)

export const createBooking = (booking: CreateBooking) =>
  api
    .post<BookingDTO>(`/escape-room/${booking.escapeRoomId}/booking`, toCreateBookingDTO(booking))
    .then(res => res.data)
    .then(fromBookingDTO)

export const getAvailability = (escapeRoomId: string, date: Date) =>
  api
    .get<TimeslotDTO[]>(`escape-room/${escapeRoomId}/availability`, { params: { date } })
    .then(res => res.data.map(fromTimeslotDTO))
