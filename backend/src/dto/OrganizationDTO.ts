import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { omit } from 'ramda'

export type OrganizationDTO = Omit<OrganizationEntity, 'members' | 'escapeRooms'>

export function toOrganizationDTO(organization: OrganizationEntity): OrganizationDTO {
  return omit(['members', 'escapeRooms'])(organization)
}
