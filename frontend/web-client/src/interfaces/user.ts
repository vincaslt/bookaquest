import {
  BasicUserInfoDTO,
  CreateUserDTO,
  UserInfoDTO,
  UserMembershipDTO,
  UserOrganizationDTO
} from '@commons/interfaces/dto/user'

export type CreateUser = CreateUserDTO

export type BasicUserInfo = Omit<BasicUserInfoDTO, 'createdAt'> & {
  createdAt: Date
}

export type UserOrganization = Omit<UserOrganizationDTO, 'createdAt'> & {
  createdAt: Date
}
export type UserMembership = Omit<UserMembershipDTO, 'createdAt' | 'organization'> & {
  createdAt: Date
  organization: UserOrganization
}
export type UserInfo = Omit<UserInfoDTO, 'createdAt' | 'memberships'> & {
  createdAt: Date
  memberships: UserMembership[]
}

export function fromUserOrganizationDTO(dto: UserOrganizationDTO): UserOrganization {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt)
  }
}

export function fromUserMembershipDTO(dto: UserMembershipDTO): UserMembership {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    organization: fromUserOrganizationDTO(dto.organization)
  }
}

export function fromBasicUserInfoDTO(dto: BasicUserInfoDTO): BasicUserInfo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt)
  }
}

export function fromUserInfoDTO(dto: UserInfoDTO): UserInfo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    memberships: dto.memberships.map(fromUserMembershipDTO)
  }
}
