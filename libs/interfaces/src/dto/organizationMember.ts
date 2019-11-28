import { UserInfoDTO } from './user';
import { OrganizationDTO } from './organization';

export interface OrganizationMemberDTO {
  _id: string;
  isOwner: boolean;
  user: UserInfoDTO;
  createdAt: string;
  updatedAt: string;
}

export interface MemberInvitationDTO {
  _id: string;
  user: UserInfoDTO;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationInvitationDTO {
  _id: string;
  organization: OrganizationDTO;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteOrganizationMemberDTO {
  email: string;
}
