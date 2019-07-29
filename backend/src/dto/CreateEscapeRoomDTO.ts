import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateEscapeRoomDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  // TODO: validate 0-24/1-7
  @IsNumber(undefined, { each: true })
  weekDays: number[]

  @IsNumber(undefined, { each: true })
  workHours: number[]

  @IsNumber()
  interval: number

  @IsString()
  location: string
}
