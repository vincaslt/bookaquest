import { omit } from 'ramda';
import { OrganizationMembershipEntity } from '../entities/OrganizationMembershipEntity';
import { toBasicUserInfoDTO, BasicUserInfo } from './UserInfoDTO';

export type OrganizationMemberDTO = Omit<
  OrganizationMembershipEntity,
  'organization' | 'user'
> & {
  user: BasicUserInfo;
};

export function toMemberDTO(
  membership: OrganizationMembershipEntity
): OrganizationMemberDTO {
  return {
    ...omit(['organization'])(membership),
    user: toBasicUserInfoDTO(membership.user)
  };
}
