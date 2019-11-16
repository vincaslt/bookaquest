import { omit } from 'ramda';
import { PaymentDetailsEntity } from '../entities/PaymentDetailsEntity';
import { OrganizationBusinessHoursEntity } from '../entities/OrganizationBusinessHoursEntity';
import { OrganizationEntity } from '../entities/OrganizationEntity';

export type PaymentDetailsDTO = Omit<
  PaymentDetailsEntity,
  'paymentSecretKey' | 'id' | 'organization' | 'organizationId'
>;

export type OrganizationBusinessHoursDTO = Omit<
  OrganizationBusinessHoursEntity,
  'organization' | 'organizationId'
>;

export type OrganizationDTO = Omit<
  OrganizationEntity,
  'members' | 'escapeRooms' | 'businessHours' | 'paymentDetails'
> & {
  businessHours: OrganizationBusinessHoursDTO[];
  paymentDetails?: PaymentDetailsDTO;
};

export function toPaymentDetailsDTO(
  paymentDetails: PaymentDetailsEntity
): PaymentDetailsDTO {
  return omit(['paymentSecretKey', 'id', 'organizationId', 'organization'])(
    paymentDetails
  );
}

export function toOrganizationBusinessHoursDTO(
  businessHours: OrganizationBusinessHoursEntity
): OrganizationBusinessHoursDTO {
  return omit(['organizationId', 'organization'])(businessHours);
}

export function toOrganizationDTO(
  organization: OrganizationEntity
): OrganizationDTO {
  return {
    ...omit(['members', 'escapeRooms', 'businessHours'])(organization),
    businessHours: organization.businessHours.map(
      toOrganizationBusinessHoursDTO
    ),
    paymentDetails:
      organization.paymentDetails &&
      toPaymentDetailsDTO(organization.paymentDetails)
  };
}
