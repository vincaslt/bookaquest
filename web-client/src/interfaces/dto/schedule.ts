export interface CreateScheduleDTO {
  weekDays: number[]
  workHours: [number, number] // TODO: could also be extended to multiple ranges after
}
