import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  password: string;
}
