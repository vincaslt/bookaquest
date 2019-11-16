import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { BusinessHoursDTO } from './BusinessHoursDTO';
import { PricingType } from '../entities/EscapeRoomEntity';

export class CreateEscapeRoomDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  // TODO: somehow validate if it's a valid image
  @IsNotEmpty()
  @IsUrl(undefined, { each: true })
  images: string[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDTO)
  businessHours: BusinessHoursDTO[];

  @IsNotEmpty()
  @IsString()
  timezone: string;

  @IsNotEmpty()
  @IsNumber()
  interval: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber(undefined, { each: true })
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  participants: [number, number];

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: number;

  @IsOptional()
  @IsBoolean()
  paymentEnabled?: boolean;

  @IsNotEmpty()
  @IsEnum(PricingType)
  pricingType?: PricingType;
}