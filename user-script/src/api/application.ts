import Axios from 'axios'
import { CreateBooking, toCreateBookingDTO } from '../interfaces/createBooking'
import { EscapeRoomDTO } from '../interfaces/dto/escapeRoom'
import { TimeslotDTO } from '../interfaces/dto/timeslot'
import { fromEscapeRoomDTO } from '../interfaces/escapeRoom'
import { fromTimeslotDTO } from '../interfaces/timeslot'

const api = Axios.create({
  baseURL: 'http://localhost:3001'
})

export const getEscapeRooms = (organizationId: string) =>
  api
    .get<EscapeRoomDTO[]>(`/organization/${organizationId}/escape-room`)
    .then(res => res.data.map(fromEscapeRoomDTO))

export const createBooking = (booking: CreateBooking) =>
  api
    .post(`/escape-room/${booking.escapeRoomId}/booking`, toCreateBookingDTO(booking))
    .then(res => res.data)

export const getAvailability = (escapeRoomId: string, date: Date) =>
  api
    .get<TimeslotDTO[]>(`escape-room/${escapeRoomId}/availability`, { params: { date } })
    .then(res => res.data.map(fromTimeslotDTO))
