import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateOrganizationDTO {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsUrl()
  website: string

  // TODO: validate 0-24/1-7
  @IsOptional()
  @IsNumber(undefined, { each: true })
  weekDays: number[]

  @IsOptional()
  @IsNumber(undefined, { each: true })
  workHours: number[]

  @IsOptional()
  @IsNumber()
  interval: number

  @IsOptional()
  @IsString()
  location: string
}
