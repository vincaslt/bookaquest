import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @Matches(/^((\w|\.|,)+(\s(?!$)|$))+$/)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
