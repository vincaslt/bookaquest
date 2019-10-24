import { Type } from 'class-transformer'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches
} from 'class-validator'

export class CreateBookingDTO {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date

  @IsNotEmpty()
  @Matches(/^((\w|\.|,)+(\s(?!$)|$))+$/)
  name: string

  @IsNotEmpty()
  @IsPhoneNumber('ZZ')
  phoneNumber: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsNumber()
  participants: number

  @IsOptional()
  @IsString()
  paymentToken: string
}
