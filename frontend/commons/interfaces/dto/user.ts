export interface UserOrganizationDTO {
  id: string
  name: string
  website: string
  location: string
  weekDays: number[]
  workHours: number[]
  createdAt: string
}

export interface UserMembershipDTO {
  isOwner: boolean
  createdAt: string
  organization: UserOrganizationDTO
}

export interface BasicUserInfoDTO {
  id: string
  email: string
  fullName: string
  createdAt: string
}

export interface UserInfoDTO extends BasicUserInfoDTO {
  memberships: UserMembershipDTO[]
}

export interface CreateUserDTO {
  fullName: string
  email: string
  password: string
}
