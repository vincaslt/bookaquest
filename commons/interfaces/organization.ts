import omit from 'ramda/es/omit'
import { OrganizationDTO } from './dto/organization'

export type Organization = Omit<OrganizationDTO, 'createdAt'> & {
  createdAt: Date
}

export function fromOrganizationDTO(dto: OrganizationDTO): Organization {
  return {
    ...omit(['createdAt'])(dto),
    createdAt: new Date(dto.createdAt)
  }
}
