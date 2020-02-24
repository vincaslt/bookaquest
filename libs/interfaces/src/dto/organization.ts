import { BusinessHoursDTO } from './businessHours';

export interface CreatePaymentDetailsDTO {
  paymentClientKey: string;
  paymentSecretKey: string;
}

export interface PaymentDetailsDTO {
  paymentClientKey: string;
}

export interface OrganizationDTO {
  _id: string;
  name: string;
  website?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
  businessHours?: BusinessHoursDTO[];
  paymentDetails?: PaymentDetailsDTO;
}

export interface CreateOrganizationDTO {
  name: string;
  website?: string;
  location?: string;
  businessHours?: BusinessHoursDTO[];
  timezone?: string;
  paymentDetails?: CreatePaymentDetailsDTO;
}

export interface UpdateOrganizationDTO {
  name?: string;
  website?: string;
  location?: string;
  businessHours?: BusinessHoursDTO[];
  timezone?: string;
  paymentDetails?: CreatePaymentDetailsDTO;
}
