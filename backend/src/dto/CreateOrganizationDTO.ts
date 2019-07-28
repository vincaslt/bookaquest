import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUrl()
  website: string
}
