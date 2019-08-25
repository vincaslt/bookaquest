export interface CreateEscapeRoomDTO {
  name: string
  description: string
  weekDays?: number[]
  workHours?: number[]
  interval?: number
  location?: string
}

export interface EscapeRoomDTO {
  id: string
  organizationId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  weekDays?: number[]
  workHours?: number[]
  interval?: number
  location?: string
}
