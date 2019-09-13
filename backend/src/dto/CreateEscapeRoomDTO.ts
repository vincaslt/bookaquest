import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator'

export class CreateEscapeRoomDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number

  // TODO: somehow validate if it's a valid image
  @IsNotEmpty()
  @IsUrl(undefined, { each: true })
  images: string[]

  // TODO: validate 0-24/1-7
  @IsOptional()
  @IsNumber(undefined, { each: true })
  weekDays?: number[]

  @IsOptional()
  @IsNumber(undefined, { each: true })
  workHours?: number[]

  @IsOptional()
  @IsNumber()
  interval?: number

  @IsOptional()
  @IsString()
  location?: string
}
