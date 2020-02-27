import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { PricingType } from '../models/EscapeRoom';
import { IsCurrencyCode } from '../utils/validators';
import { BusinessHoursDTO } from './BusinessHoursDTO';

export class UpdateEscapeRoomDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDTO)
  businessHours?: BusinessHoursDTO[];

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsNumber()
  interval?: number;

  @IsOptional()
  @IsNumber(undefined, { each: true })
  @Min(1, { each: true })
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  participants?: [number, number];

  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsCurrencyCode()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  paymentEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: number;

  @IsOptional()
  @IsString()
  location: string;
}
