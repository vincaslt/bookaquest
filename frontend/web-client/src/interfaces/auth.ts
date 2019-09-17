import { SignInDTO } from '@commons/interfaces/dto/auth'

export interface JwtPayload {
  userId: string
  expires: Date
}

export type SignIn = SignInDTO
