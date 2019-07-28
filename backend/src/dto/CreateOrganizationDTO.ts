import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUrl()
  website: string

  // TODO: validate 0-24/1-7
  @IsNumber(undefined, { each: true })
  weekDays: number[]

  @IsNumber(undefined, { each: true })
  workHours: number[]
}
