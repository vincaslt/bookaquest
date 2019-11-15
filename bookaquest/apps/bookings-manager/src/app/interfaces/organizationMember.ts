import { OrganizationMemberDTO } from '@bookaquest/interfaces';
import { BasicUserInfo, fromBasicUserInfoDTO } from './user';

export type OrganizationMember = Omit<OrganizationMemberDTO, 'user'> & {
  user: BasicUserInfo;
};

export function fromOrganizationMemberDTO(
  dto: OrganizationMemberDTO
): OrganizationMember {
  return {
    ...dto,
    user: fromBasicUserInfoDTO(dto.user)
  };
}
