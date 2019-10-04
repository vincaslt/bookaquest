import { BusinessHoursDTO } from '@app/dto/BusinessHoursDTO'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

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
}
