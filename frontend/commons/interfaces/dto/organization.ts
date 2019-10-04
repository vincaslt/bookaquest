import { BusinessHoursDTO } from './businessHours'

export interface OrganizationDTO {
  id: string
  name: string
  website: string
  location: string
  createdAt: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
}

export interface CreateOrganizationDTO {
  name: string
  website: string
  location: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
}

export interface UpdateOrganizationDTO {
  name?: string
  website?: string
  location?: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
}
