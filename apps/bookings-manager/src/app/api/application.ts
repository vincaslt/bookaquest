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
  OrganizationMemberDTO,
  InviteOrganizationMemberDTO,
  MemberInvitationDTO,
  OrganizationInvitationDTO,
  toCreateEscapeRoomDTO
} from '@bookaquest/interfaces';
import map from 'ramda/es/map';
import { SignIn } from '../interfaces/auth';
import {
  CreateOrganization,
  UpdateOrganization
} from '../interfaces/organization';
import {
  fromOrganizationMemberDTO,
  fromMemberInvitationDTO,
  fromOrganizationInvitationDTO
} from '../interfaces/organizationMember';
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
    .post<{
      tokens: AuthTokensDTO;
      user: UserInfoDTO;
      memberships: UserMembershipDTO[];
      invitations: OrganizationInvitationDTO[];
    }>('/login', credentials)
    .then(res => ({
      tokens: res.data.tokens,
      user: fromUserInfoDTO(res.data.user),
      memberships: res.data.memberships.map(fromUserMembershipDTO),
      invitations: res.data.invitations.map(fromOrganizationInvitationDTO)
    }));

export const signOut = withAuth(headers => () =>
  api.post('/logout', undefined, { headers })
);

export const getAuthUserInfo = withAuth(headers => () =>
  api
    .get<{
      user: UserInfoDTO;
      memberships: UserMembershipDTO[];
      invitations: OrganizationInvitationDTO[];
    }>('/user/me', {
      headers
    })
    .then(res => res.data)
    .then(({ user, memberships, invitations }) => ({
      user: fromUserInfoDTO(user),
      memberships: memberships.map(fromUserMembershipDTO),
      invitations: invitations.map(fromOrganizationInvitationDTO)
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
  headers => (organizationId: string, data: CreateEscapeRoom) =>
    api
      .post<EscapeRoomDTO>(
        `/organization/${organizationId}/escape-room`,
        toCreateEscapeRoomDTO(data),
        {
          headers
        }
      )
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
      .then(res => res.data)
      .then(map(fromUserMembershipDTO))
);

export const updateOrganization = withAuth(
  headers => (organizationId: string, dto: UpdateOrganization) =>
    api
      .put<OrganizationDTO>(`/organization/${organizationId}`, dto, { headers })
      .then(res => res.data)
      .then(fromOrganizationDTO)
);

export const getOrganizationBookings = withAuth(
  headers => (
    organizationId: string,
    params: {
      from?: Date;
      to?: Date;
      select?: 'upcoming' | 'historical';
    }
  ) =>
    api
      .get<BookingDTO[]>(`/organization/${organizationId}/booking`, {
        headers,
        params
      })
      .then(res => res.data)
      .then(map(fromBookingDTO))
);

export const getEscapeRoomBookings = withAuth(
  headers => (
    escapeRoomId: string,
    params: {
      from?: Date;
      to?: Date;
      offset?: number;
      take?: number;
    }
  ) =>
    api
      .get<{ bookings: BookingDTO[]; total: number }>(
        `/escape-room/${escapeRoomId}/booking`,
        {
          headers,
          params
        }
      )
      .then(res => res.data)
      .then(({ bookings, total }) => ({
        bookings: bookings.map(fromBookingDTO),
        total
      }))
);

export const getOrganizationMembers = withAuth(
  headers => (organizationId: string) =>
    api
      .get<{
        invitations: MemberInvitationDTO[];
        memberships: OrganizationMemberDTO[];
      }>(`/organization/${organizationId}/member`, {
        headers
      })
      .then(res => res.data)
      .then(({ invitations, memberships }) => ({
        memberships: memberships.map(fromOrganizationMemberDTO),
        invitations: invitations.map(fromMemberInvitationDTO)
      }))
);

export const rejectBooking = withAuth(headers => (bookingId: string) =>
  api
    .put<BookingDTO[]>(`/booking/${bookingId}/reject`, undefined, { headers })
    .then(res => res.data)
    .then(map(fromBookingDTO))
);

export const acceptBooking = withAuth(headers => (bookingId: string) =>
  api
    .put<BookingDTO[]>(`/booking/${bookingId}/accept`, undefined, { headers })
    .then(res => res.data)
    .then(map(fromBookingDTO))
);

export const getOrganization = (organizationId: string) =>
  api
    .get<OrganizationDTO>(`/organization/${organizationId}`)
    .then(res => res.data)
    .then(fromOrganizationDTO);

export const deleteEscapeRoom = withAuth(headers => (escapeRoomId: string) =>
  api.delete(`/escape-room/${escapeRoomId}`, { headers })
);

export const deleteOrganizationMember = withAuth(
  headers => (organizationId: string, membershipId: string) =>
    api.delete(`/organization/${organizationId}/member/${membershipId}`, {
      headers
    })
);

export const createOrganizationInvitation = withAuth(
  headers => (organizationId: string, dto: InviteOrganizationMemberDTO) =>
    api
      .post<MemberInvitationDTO[]>(
        `/organization/${organizationId}/member`,
        dto,
        { headers }
      )
      .then(res => res.data)
      .then(map(fromMemberInvitationDTO))
);

export const acceptInvitation = withAuth(headers => (invitationId: string) =>
  api
    .post<{
      memberships: UserMembershipDTO[];
      invitations: OrganizationInvitationDTO[];
    }>(`/invitation/${invitationId}/accept`, undefined, { headers })
    .then(res => ({
      memberships: res.data.memberships.map(fromUserMembershipDTO),
      invitations: res.data.invitations.map(fromOrganizationInvitationDTO)
    }))
);

export const declineInvitation = withAuth(headers => (invitationId: string) =>
  api
    .post<OrganizationInvitationDTO[]>(
      `/invitation/${invitationId}/decline`,
      undefined,
      { headers }
    )
    .then(res => res.data)
    .then(map(fromOrganizationInvitationDTO))
);

export const getBooking = (bookingId: string) =>
  api
    .get<BookingDTO>(`/booking/${bookingId}?noRoom=true`)
    .then(res => res.data)
    .then(fromBookingDTO);
