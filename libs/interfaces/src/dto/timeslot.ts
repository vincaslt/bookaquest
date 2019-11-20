export interface TimeslotDTO {
  start: string;
  end: string;
}

export type AvailabilityDTO = Array<{
  date: string;
  availableTimeslots: TimeslotDTO[];
}>;
