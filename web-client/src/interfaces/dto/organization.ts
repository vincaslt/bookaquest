export interface CreateOrganizationDTO {
  name: string
  website: string
  location: string
}

export interface UpdateOrganizationDTO {
  name?: string
  website?: string
  location?: string
  weekDays?: number[]
  workHours?: number[]
}
