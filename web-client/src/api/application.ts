import { SignIn } from '../interfaces/auth'
import { AuthTokensDTO, RefreshTokenDTO, RequestRefreshTokenDTO } from '../interfaces/dto/auth'
import { UserInfoDTO } from '../interfaces/dto/user'
import { CreateSchedule } from '../interfaces/schedule'
import { CreateUser, fromUserInfoDTO } from '../interfaces/user'
import { api, withAuth } from '../utils/apiHelpers'

// TODO: should be CreateUser and convert to DTO before sending
export const register = (user: CreateUser) => api.post('/user', user).then(res => res.data)

export const signIn = (credentials: SignIn) =>
  api.post<{ tokens: AuthTokensDTO; user: UserInfoDTO }>('/login', credentials).then(res => ({
    tokens: res.data.tokens,
    userInfo: fromUserInfoDTO(res.data.user)
  }))

export const refreshAuthToken = (dto: RequestRefreshTokenDTO) =>
  api.post<RefreshTokenDTO>('/refreshToken', dto).then(res => res.data)

export const createSchedule = withAuth(headers => (schedule: CreateSchedule) =>
  api.post('/schedule', schedule, { headers }).then(res => res.data)
)

export const getAuthUserInfo = withAuth(headers => () =>
  api
    .get<UserInfoDTO>('/user/me', { headers })
    .then(res => res.data)
    .then(fromUserInfoDTO)
)
