import { BusinessHoursDTO } from '@app/dto/BusinessHoursDTO'
import { CreatePaymentDetailsDTO } from '@app/dto/CreatePaymentDetailsDTO'
import { Type } from 'class-transformer'
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator'

export class UpdateOrganizationDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsUrl()
  website?: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDTO)
  businessHours?: BusinessHoursDTO[]

  @IsOptional()
  @IsString()
  timezone?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePaymentDetailsDTO)
  paymentDetails?: CreatePaymentDetailsDTO
}
