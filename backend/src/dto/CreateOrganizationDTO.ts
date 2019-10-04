import { BusinessHoursDTO } from '@app/dto/BusinessHoursDTO'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator'

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUrl()
  website: string

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
}
