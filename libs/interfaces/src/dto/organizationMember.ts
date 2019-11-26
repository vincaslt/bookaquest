import { UserInfoDTO } from './user';

export interface OrganizationMemberDTO {
  _id: string;
  isOwner: boolean;
  user: UserInfoDTO;
  createdAt: string;
  updatedAt: string;
}

export interface InviteOrganizationMemberDTO {
  email: string;
}
