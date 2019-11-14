import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  refreshToken: string;

  @IsNotEmpty()
  userId: string;
}
