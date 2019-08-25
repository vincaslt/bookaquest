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

export interface UserInfoDTO {
  id: string
  email: string
  fullName: string
  memberships: UserMembershipDTO[]
  createdAt: string
}

export interface CreateUserDTO {
  fullName: string
  email: string
  password: string
}
