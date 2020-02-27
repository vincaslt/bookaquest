import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  IsEmail,
  IsPhoneNumber
} from 'class-validator';
import { BusinessHoursDTO } from './BusinessHoursDTO';
import { CreatePaymentDetailsDTO } from './CreatePaymentDetailsDTO';

export class UpdateOrganizationDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl(undefined, {
    message: 'Invalid url, make sure it starts with http(s)'
  })
  website?: string;

  @IsOptional()
  @IsEmail(undefined, { message: 'Invalid email, make sure it includes @' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ', {
    message: 'Invalid phone number, make sure it has a country code (e.g. +370)'
  })
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDTO)
  businessHours?: BusinessHoursDTO[];

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePaymentDetailsDTO)
  paymentDetails?: CreatePaymentDetailsDTO;
}
