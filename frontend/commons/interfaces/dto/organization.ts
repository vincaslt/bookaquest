import { BusinessHoursDTO } from './businessHours'

interface CreatePaymentDetailsDTO {
  paymentClientKey: string
  paymentSecretKey: string
}

interface PaymentDetailsDTO {
  paymentClientKey: string
}

export interface OrganizationDTO {
  id: string
  name: string
  website: string
  location: string
  createdAt: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
  paymentDetails?: PaymentDetailsDTO
}

export interface CreateOrganizationDTO {
  name: string
  website: string
  location: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
  paymentDetails?: CreatePaymentDetailsDTO
}

export interface UpdateOrganizationDTO {
  name?: string
  website?: string
  location?: string
  businessHours?: BusinessHoursDTO[]
  timezone?: string
  paymentDetails?: CreatePaymentDetailsDTO
}
