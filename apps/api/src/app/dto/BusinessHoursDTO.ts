import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  Min
} from 'class-validator';

export class BusinessHoursDTO {
  @IsNotEmpty()
  @Max(7)
  @Min(1)
  @IsNumber()
  weekday: number;

  @IsNotEmpty()
  @IsNumber(undefined, { each: true })
  @Max(24, { each: true })
  @Min(0, { each: true })
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  hours: number[];
}
