import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUrl()
  website: string

  // TODO: validate 0-24/1-7
  @IsOptional()
  @IsNumber(undefined, { each: true })
  weekDays?: number[]

  @IsOptional()
  @IsNumber(undefined, { each: true })
  workHours?: number[]

  @IsOptional()
  @IsString()
  location?: string
}
