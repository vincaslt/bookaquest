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

// ! TODO: fix validation messages to be more descriptive
export class UpdateOrganizationDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ')
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
