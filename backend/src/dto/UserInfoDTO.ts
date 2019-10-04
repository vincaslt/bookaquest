import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { omit } from 'ramda'

export type BasicUserInfo = Omit<UserEntity, 'password' | 'memberships'>

export type UserMembershipDTO = Omit<OrganizationMembershipEntity, 'userId'>

export type UserInfoDTO = BasicUserInfo & {
  memberships: UserMembershipDTO[]
}

export function toUserMembershipDTO(membership: OrganizationMembershipEntity): UserMembershipDTO {
  return {
    ...omit(['userId'])(membership)
  }
}

export function toBasicUserInfoDTO(user: UserEntity): BasicUserInfo {
  return omit(['password', 'memberships'])(user)
}

export function toUserInfoDTO(user: UserEntity): UserInfoDTO {
  return {
    ...toBasicUserInfoDTO(user),
    memberships: user.memberships.map(toUserMembershipDTO)
  }
}
