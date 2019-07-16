import { SignIn } from '../interfaces/auth'
import { AuthTokenDTO, RefreshTokenDTO, RequestRefreshTokenDTO } from '../interfaces/dto/auth'
import { CreateSchedule } from '../interfaces/schedule'
import { CreateUser } from '../interfaces/user'
import { api, withAuth } from '../utils/apiHelpers'

// TODO: should be CreateUser and convert to DTO before sending
export const register = (user: CreateUser) => api.post('/user', user).then(res => res.data)

export const signIn = (credentials: SignIn) =>
  api.post<AuthTokenDTO>('/login', credentials).then(res => res.data)

export const refreshAuthToken = (dto: RequestRefreshTokenDTO) =>
  api.post<RefreshTokenDTO>('/refreshToken', dto).then(res => res.data)

export const createSchedule = withAuth(headers => (schedule: CreateSchedule) =>
  api.post('/schedule', schedule, { headers }).then(res => res.data)
)
