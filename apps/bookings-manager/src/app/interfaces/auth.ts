import { SignInDTO } from '@bookaquest/interfaces';

export interface JwtPayload {
  userId: string;
  expires: Date;
}

export type SignIn = SignInDTO;
