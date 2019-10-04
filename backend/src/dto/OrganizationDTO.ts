import { OrganizationBusinessHoursEntity } from '@app/entities/OrganizationBusinessHoursEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { omit } from 'ramda'

export type OrganizationBusinessHoursDTO = Omit<
  OrganizationBusinessHoursEntity,
  'organization' | 'organizationId'
>

export type OrganizationDTO = Omit<
  OrganizationEntity,
  'members' | 'escapeRooms' | 'businessHours'
> & {
  businessHours: OrganizationBusinessHoursDTO[]
}

export function toOrganizationBusinessHoursDTO(
  businessHours: OrganizationBusinessHoursEntity
): OrganizationBusinessHoursDTO {
  return omit(['organizationId', 'organization'])(businessHours)
}

export function toOrganizationDTO(organization: OrganizationEntity): OrganizationDTO {
  return {
    ...omit(['members', 'escapeRooms', 'businessHours'])(organization),
    businessHours: organization.businessHours.map(toOrganizationBusinessHoursDTO)
  }
}
