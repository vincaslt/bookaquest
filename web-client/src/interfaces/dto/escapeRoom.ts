export interface CreateEscapeRoomDTO {
  name: string
  description: string
  images: string[]
  price: number
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
  images: string[]
  weekDays: number[]
  workHours: number[]
  interval: number
  price: number
  location?: string
}
