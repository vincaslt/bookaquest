import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateEscapeRoomDTO {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  // TODO: validate 0-24/1-7
  @IsOptional()
  @IsNumber(undefined, { each: true })
  weekDays: number[]

  @IsOptional()
  @IsNumber(undefined, { each: true })
  workHours: number[]

  @IsOptional()
  @IsNumber()
  interval: number
}
