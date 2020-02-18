export interface TimeslotDTO {
  start: string;
  end: string;
  price: number;
}

export type AvailabilityDTO = Array<{
  date: string;
  availableTimeslots: TimeslotDTO[];
}>;
