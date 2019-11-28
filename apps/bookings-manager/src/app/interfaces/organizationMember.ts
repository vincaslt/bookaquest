import {
  OrganizationMemberDTO,
  InviteOrganizationMemberDTO,
  OrganizationInvitationDTO,
  Organization,
  MemberInvitationDTO,
  fromOrganizationDTO
} from '@bookaquest/interfaces';
import { UserInfo, fromUserInfoDTO } from './user';

export enum InvitationStatus {
  PENDING = 'pending',
  DECLINED = 'declined',
  ACCEPTED = 'accepted'
}

export type InviteOrganizationMember = InviteOrganizationMemberDTO;

export type OrganizationMember = Omit<
  OrganizationMemberDTO,
  'user' | 'createdAt' | 'updatedAt'
> & {
  user: UserInfo;
  createdAt: Date;
  updatedAt: Date;
};

export function fromOrganizationMemberDTO(
  dto: OrganizationMemberDTO
): OrganizationMember {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    user: fromUserInfoDTO(dto.user)
  };
}

/** For use in user info */
export type OrganizationInvitation = Omit<
  OrganizationInvitationDTO,
  'organization' | 'createdAt' | 'updatedAt' | 'status'
> & {
  organization: Organization;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export function fromOrganizationInvitationDTO(
  dto: OrganizationInvitationDTO
): OrganizationInvitation {
  return {
    ...dto,
    status: dto.status as InvitationStatus,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    organization: fromOrganizationDTO(dto.organization)
  };
}

/** For use in user info */
export type MemberInvitation = Omit<
  MemberInvitationDTO,
  'user' | 'createdAt' | 'updatedAt' | 'status'
> & {
  user: UserInfo;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export function fromMemberInvitationDTO(
  dto: MemberInvitationDTO
): MemberInvitation {
  return {
    ...dto,
    status: dto.status as InvitationStatus,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    user: fromUserInfoDTO(dto.user)
  };
}
