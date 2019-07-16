import { SignInDTO } from './dto/auth'

export interface JwtPayload {
  userId: string
  expires: Date
}

export type SignIn = SignInDTO
