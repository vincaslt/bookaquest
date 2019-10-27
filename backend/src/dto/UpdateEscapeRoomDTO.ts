import { BusinessHoursDTO } from '@app/dto/BusinessHoursDTO'
import { PricingType } from '@app/entities/EscapeRoomEntity'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class UpdateEscapeRoomDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDTO)
  businessHours?: BusinessHoursDTO[]

  @IsOptional()
  @IsString()
  timezone?: string

  @IsOptional()
  @IsNumber()
  interval?: number

  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType
}
