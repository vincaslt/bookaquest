import { TimeslotDTO } from './dto/timeslot'

export type Timeslot = Omit<TimeslotDTO, 'start' | 'end'> & {
  start: Date
  end: Date
}

export function fromTimeslotDTO(dto: TimeslotDTO): Timeslot {
  return {
    ...dto,
    start: new Date(dto.start),
    end: new Date(dto.end)
  }
}
