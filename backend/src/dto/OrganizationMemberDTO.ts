import { BasicUserInfo, toBasicUserInfoDTO } from '@app/dto/UserInfoDTO'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { omit } from 'ramda'

export type OrganizationMemberDTO = Omit<OrganizationMembershipEntity, 'organization' | 'user'> & {
  user: BasicUserInfo
}

export function toMemberDTO(membership: OrganizationMembershipEntity): OrganizationMemberDTO {
  return {
    ...omit(['organization'])(membership),
    user: toBasicUserInfoDTO(membership.user)
  }
}
