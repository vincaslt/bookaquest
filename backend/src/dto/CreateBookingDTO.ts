import { Type } from 'class-transformer'
import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator'

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
}
