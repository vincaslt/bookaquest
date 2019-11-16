import { BasicUserInfoDTO } from './user'

export interface OrganizationMemberDTO {
  organizationId: string
  userId: string
  isOwner: boolean
  user: BasicUserInfoDTO
  createdAt: string
}
