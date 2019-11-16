import { AvailabilityDTO, TimeslotDTO } from '../dto/timeslot';

export type Timeslot = Omit<TimeslotDTO, 'start' | 'end'> & {
  start: Date;
  end: Date;
};

export type Availability = Array<{
  date: Date;
  availableTimeslots: Timeslot[];
}>;

export function fromTimeslotDTO(dto: TimeslotDTO): Timeslot {
  return {
    ...dto,
    start: new Date(dto.start),
    end: new Date(dto.end)
  };
}

export function fromAvailabilityDTO(dtoArr: AvailabilityDTO): Availability {
  return dtoArr.map(dto => ({
    ...dto,
    date: new Date(dto.date),
    availableTimeslots: dto.availableTimeslots.map(fromTimeslotDTO)
  }));
}
