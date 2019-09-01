import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { omit } from 'ramda'

export type UserOrganizationDTO = Omit<OrganizationEntity, 'members' | 'escapeRooms'>

export type UserMembershipDTO = Omit<
  OrganizationMembershipEntity,
  'userId' | 'organizationId' | 'organization'
> & {
  organization: UserOrganizationDTO
}

export type UserInfoDTO = Omit<UserEntity, 'password' | 'memberships'> & {
  memberships: UserMembershipDTO[]
}

export function toUserOrganizationDTO(organization: OrganizationEntity): UserOrganizationDTO {
  return omit(['members', 'escapeRooms'])(organization)
}

export function toUserMembershipDTO(membership: OrganizationMembershipEntity): UserMembershipDTO {
  return {
    ...omit(['userId', 'organizationId', 'organization'], membership),
    organization: toUserOrganizationDTO(membership.organization)
  }
}

export function toUserInfoDTO(user: UserEntity): UserInfoDTO {
  return {
    ...omit(['password', 'memberships'], user),
    memberships: user.memberships.map(toUserMembershipDTO)
  }
}
