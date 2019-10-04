import { IsNotEmpty, IsNumber } from 'class-validator'

export class BusinessHoursDTO {
  @IsNotEmpty()
  @IsNumber()
  weekday: number

  // TODO: validate 0-24/1-7
  @IsNotEmpty()
  @IsNumber(undefined, { each: true })
  hours: number[]
}
