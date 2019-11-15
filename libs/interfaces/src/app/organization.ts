import omit from 'ramda/es/omit';
import { BusinessHours } from './businessHours';
import { CreatePaymentDetailsDTO, OrganizationDTO } from '../dto/organization';

export type CreatePaymentDetails = CreatePaymentDetailsDTO;

export type Organization = Omit<
  OrganizationDTO,
  'createdAt' | 'businessHours'
> & {
  createdAt: Date;
  businessHours?: BusinessHours[];
};

export function fromOrganizationDTO(dto: OrganizationDTO): Organization {
  return {
    ...omit(['createdAt'])(dto),
    createdAt: new Date(dto.createdAt)
  };
}
