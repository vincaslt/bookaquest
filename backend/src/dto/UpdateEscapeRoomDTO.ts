import { BusinessHoursDTO } from '@app/dto/BusinessHoursDTO'
import { PricingType } from '@app/entities/EscapeRoomEntity'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator'

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

  @IsOptional()
  @IsNumber(undefined, { each: true })
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  participants?: [number, number]

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number
}
