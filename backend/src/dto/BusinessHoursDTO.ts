import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class BusinessHoursDTO {
  @IsNotEmpty()
  @IsNumber()
  weekday: number

  @IsNotEmpty()
  @IsNumber(undefined, { each: true })
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  hours: number[]
}
