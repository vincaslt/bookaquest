import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateOrganizationInvitationDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
