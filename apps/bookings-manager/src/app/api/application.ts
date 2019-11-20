import {
  AuthTokensDTO,
  UserInfoDTO,
  EscapeRoomDTO,
  fromEscapeRoomDTO,
  CreateEscapeRoom,
  UpdateEscapeRoom,
  UserMembershipDTO,
  OrganizationDTO,
  fromOrganizationDTO,
  BookingDTO,
  fromBookingDTO,
  OrganizationMemberDTO
} from '@bookaquest/interfaces';
import { SignIn } from '../interfaces/auth';
import {
  CreateOrganization,
  UpdateOrganization
} from '../interfaces/organization';
import { fromOrganizationMemberDTO } from '../interfaces/organizationMember';
import {
  CreateUser,
  fromUserInfoDTO,
  fromUserMembershipDTO
} from '../interfaces/user';
import { api, withAuth } from '../utils/apiHelpers';

export const register = (user: CreateUser) =>
  api.post('/user', user).then(res => res.data);

export const signIn = (credentials: SignIn) =>
  api
    .post<{ tokens: AuthTokensDTO; user: UserInfoDTO }>('/login', credentials)
    .then(res => ({
      tokens: res.data.tokens,
      userInfo: fromUserInfoDTO(res.data.user)
    }));

export const signOut = withAuth(headers => () =>
  api.post('/logout', undefined, { headers })
);

export const getAuthUserInfo = withAuth(headers => () =>
  api
    .get<{ user: UserInfoDTO; memberships: UserMembershipDTO[] }>('/user/me', {
      headers
    })
    .then(res => res.data)
    .then(({ user, memberships }) => ({
      user: fromUserInfoDTO(user),
      memberships: memberships.map(fromUserMembershipDTO)
    }))
);

export const getEscapeRooms = (organizationId: string) =>
  api
    .get<EscapeRoomDTO[]>(`/organization/${organizationId}/escape-room`)
    .then(res => res.data.map(fromEscapeRoomDTO));

export const getEscapeRoom = (escapeRoomId: string) =>
  api
    .get<EscapeRoomDTO>(`/escape-room/${escapeRoomId}`)
    .then(res => res.data)
    .then(fromEscapeRoomDTO);

export const createEscapeRoom = withAuth(
  headers => (organizationId: string, dto: CreateEscapeRoom) =>
    api
      .post<EscapeRoomDTO>(`/organization/${organizationId}/escape-room`, dto, {
        headers
      })
      .then(res => res.data)
      .then(fromEscapeRoomDTO)
);

export const updateEscapeRoom = withAuth(
  headers => (escapeRoomId: string, dto: UpdateEscapeRoom) =>
    api
      .put<EscapeRoomDTO>(`/escape-room/${escapeRoomId}`, dto, { headers })
      .then(res => res.data)
      .then(fromEscapeRoomDTO)
);

export const createOrganization = withAuth(
  headers => (dto: CreateOrganization) =>
    api
      .post<UserMembershipDTO[]>('/organization', dto, { headers })
      .then(res => res.data.map(fromUserMembershipDTO))
);

export const updateOrganization = withAuth(
  headers => (organizationId: string, dto: UpdateOrganization) =>
    api
      .put<OrganizationDTO>(`/organization/${organizationId}`, dto, { headers })
      .then(res => res.data)
      .then(fromOrganizationDTO)
);

export const getOrganizationBookings = withAuth(
  headers => (organizationId: string) =>
    api
      .get<BookingDTO[]>(`/organization/${organizationId}/booking`, { headers })
      .then(res => res.data.map(fromBookingDTO))
);

export const getEscapeRoomBookings = withAuth(
  headers => (escapeRoomId: string) =>
    api
      .get<BookingDTO[]>(`/escape-room/${escapeRoomId}/booking`, { headers })
      .then(res => res.data.map(fromBookingDTO))
);

export const getOrganizationMembers = withAuth(
  headers => (organizationId: string) =>
    api
      .get<OrganizationMemberDTO[]>(`/organization/${organizationId}/member`, {
        headers
      })
      .then(res => res.data.map(fromOrganizationMemberDTO))
);

export const rejectBooking = withAuth(headers => (bookingId: string) =>
  api
    .put<BookingDTO>(`/booking/${bookingId}/reject`, undefined, { headers })
    .then(res => res.data)
    .then(fromBookingDTO)
);

export const acceptBooking = withAuth(headers => (bookingId: string) =>
  api
    .put<BookingDTO>(`/booking/${bookingId}/accept`, undefined, { headers })
    .then(res => res.data)
    .then(fromBookingDTO)
);

export const getOrganization = (organizationId: string) =>
  api
    .get<OrganizationDTO>(`/organization/${organizationId}`)
    .then(res => res.data)
    .then(fromOrganizationDTO);
