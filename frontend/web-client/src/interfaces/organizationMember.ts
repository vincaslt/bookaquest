import { OrganizationMemberDTO } from '@commons/interfaces/dto/organizationMember'
import { BasicUserInfo, fromBasicUserInfoDTO } from './user'

export type OrganizationMember = Omit<OrganizationMemberDTO, 'user'> & {
  user: BasicUserInfo
}

export function fromOrganizationMemberDTO(dto: OrganizationMemberDTO): OrganizationMember {
  return {
    ...dto,
    user: fromBasicUserInfoDTO(dto.user)
  }
}
