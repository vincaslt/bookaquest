import { fromBookingDTO } from '../../../commons/interfaces/booking'
import {
  AuthTokensDTO,
  RefreshTokenDTO,
  RequestRefreshTokenDTO
} from '../../../commons/interfaces/dto/auth'
import { BookingDTO } from '../../../commons/interfaces/dto/booking'
import { EscapeRoomDTO } from '../../../commons/interfaces/dto/escapeRoom'
import { OrganizationMemberDTO } from '../../../commons/interfaces/dto/organizationMember'
import {
  UserInfoDTO,
  UserMembershipDTO,
  UserOrganizationDTO
} from '../../../commons/interfaces/dto/user'
import { CreateEscapeRoom, fromEscapeRoomDTO } from '../../../commons/interfaces/escapeRoom'
import { SignIn } from '../interfaces/auth'
import { CreateOrganization, UpdateOrganization } from '../interfaces/organization'
import { fromOrganizationMemberDTO } from '../interfaces/organizationMember'
import {
  CreateUser,
  fromUserInfoDTO,
  fromUserMembershipDTO,
  fromUserOrganizationDTO
} from '../interfaces/user'
import { api, withAuth } from '../utils/apiHelpers'

// TODO: should be CreateUser and convert to DTO before sending
export const register = (user: CreateUser) => api.post('/user', user).then(res => res.data)

export const signIn = (credentials: SignIn) =>
  api.post<{ tokens: AuthTokensDTO; user: UserInfoDTO }>('/login', credentials).then(res => ({
    tokens: res.data.tokens,
    userInfo: fromUserInfoDTO(res.data.user)
  }))

export const signOut = withAuth(headers => () => api.post('/logout', undefined, { headers }))

export const refreshAuthToken = (dto: RequestRefreshTokenDTO) =>
  api.post<RefreshTokenDTO>('/refreshToken', dto).then(res => res.data)

export const getAuthUserInfo = withAuth(headers => () =>
  api
    .get<UserInfoDTO>('/user/me', { headers })
    .then(res => res.data)
    .then(fromUserInfoDTO)
)

export const getEscapeRooms = (organizationId: string) =>
  api
    .get<EscapeRoomDTO[]>(`/organization/${organizationId}/escape-room`)
    .then(res => res.data.map(fromEscapeRoomDTO))

export const createEscapeRoom = withAuth(
  headers => (organizationId: string, dto: CreateEscapeRoom) =>
    api
      .post<EscapeRoomDTO>(`/organization/${organizationId}/escape-room`, dto, { headers })
      .then(res => res.data)
      .then(fromEscapeRoomDTO)
)

export const createOrganization = withAuth(headers => (dto: CreateOrganization) =>
  api
    .post<UserMembershipDTO[]>('/organization', dto, { headers })
    .then(res => res.data.map(fromUserMembershipDTO))
)

export const updateOrganization = withAuth(
  headers => (organizationId: string, dto: UpdateOrganization) =>
    api
      .put<UserOrganizationDTO>(`/organization/${organizationId}`, dto, { headers })
      .then(res => res.data)
      .then(fromUserOrganizationDTO)
)

export const getOrganizationBookings = withAuth(headers => (organizationId: string) =>
  api
    .get<BookingDTO[]>(`/organization/${organizationId}/booking`, { headers })
    .then(res => res.data.map(fromBookingDTO))
)

export const getOrganizationMembers = withAuth(headers => (organizationId: string) =>
  api
    .get<OrganizationMemberDTO[]>(`/organization/${organizationId}/member`, { headers })
    .then(res => res.data.map(fromOrganizationMemberDTO))
)
