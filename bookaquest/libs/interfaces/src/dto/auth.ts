export interface SignInDTO {
  email: string
  password: string
}

export interface AuthTokensDTO {
  accessToken: string
  refreshToken: string
}

export interface RequestRefreshTokenDTO {
  refreshToken: string
  userId: string
}

export interface RefreshTokenDTO {
  token: string
}
