import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  IsPositive
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
  @IsPositive({ each: true })
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  hours: number[];
}
