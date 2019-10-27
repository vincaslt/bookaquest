import { OrganizationBusinessHoursEntity } from '@app/entities/OrganizationBusinessHoursEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { PaymentDetailsEntity } from '@app/entities/PaymentDetailsEntity'
import { omit } from 'ramda'

export type PaymentDetailsDTO = Omit<
  PaymentDetailsEntity,
  'paymentSecretKey' | 'id' | 'organization' | 'organizationId'
>

export type OrganizationBusinessHoursDTO = Omit<
  OrganizationBusinessHoursEntity,
  'organization' | 'organizationId'
>

export type OrganizationDTO = Omit<
  OrganizationEntity,
  'members' | 'escapeRooms' | 'businessHours' | 'paymentDetails'
> & {
  businessHours: OrganizationBusinessHoursDTO[]
  paymentDetails?: PaymentDetailsDTO
}

export function toPaymentDetailsDTO(paymentDetails: PaymentDetailsEntity): PaymentDetailsDTO {
  return omit(['paymentSecretKey', 'id', 'organizationId', 'organization'])(paymentDetails)
}

export function toOrganizationBusinessHoursDTO(
  businessHours: OrganizationBusinessHoursEntity
): OrganizationBusinessHoursDTO {
  return omit(['organizationId', 'organization'])(businessHours)
}

export function toOrganizationDTO(organization: OrganizationEntity): OrganizationDTO {
  return {
    ...omit(['members', 'escapeRooms', 'businessHours'])(organization),
    businessHours: organization.businessHours.map(toOrganizationBusinessHoursDTO),
    paymentDetails: organization.paymentDetails && toPaymentDetailsDTO(organization.paymentDetails)
  }
}
