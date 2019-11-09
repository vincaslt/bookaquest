import { PricingType } from '../escapeRoom'
import { BusinessHoursDTO } from './businessHours'

export interface CreateEscapeRoomDTO {
  name: string
  description: string
  images: string[]
  price: number
  businessHours: BusinessHoursDTO[]
  timezone: string
  interval: number
  location: string
  participants: number[]
  difficulty: number
  pricingType?: string
  paymentEnabled?: boolean
}

export interface EscapeRoomDTO {
  id: string
  organizationId: string
  name: string
  description: string
  images: string[]
  createdAt: string
  updatedAt: string
  businessHours: BusinessHoursDTO[]
  timezone: string
  interval: number
  price: number
  location: string
  difficulty: number
  paymentEnabled: boolean
  participants: [number, number]
  pricingType: string
}

export interface UpdateEscapeRoomDTO {
  name?: string
  description?: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
  interval?: number
  pricingType?: PricingType
  participants?: [number, number]
  price?: number
}
