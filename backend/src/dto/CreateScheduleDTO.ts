import { IsNotEmpty, IsNumber } from 'class-validator'

// TODO: validate 0-24/1-7
export class CreateScheduleDTO {
  @IsNotEmpty()
  @IsNumber(undefined, { each: true })
  weekDays: number[]

  @IsNotEmpty()
  @IsNumber(undefined, { each: true })
  workHours: number[]
}
