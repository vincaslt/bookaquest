import { OrganizationMemberDTO } from '@bookaquest/interfaces';
import { UserInfo, fromUserInfoDTO } from './user';

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
