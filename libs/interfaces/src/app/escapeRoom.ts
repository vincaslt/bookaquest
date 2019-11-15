import { BusinessHours } from './businessHours';
import {
  CreateEscapeRoomDTO,
  EscapeRoomDTO,
  UpdateEscapeRoomDTO
} from '../dto/escapeRoom';

export enum PricingType {
  PER_PERSON = 'per_person',
  FLAT = 'flat'
}

export type CreateEscapeRoom = Omit<
  CreateEscapeRoomDTO,
  'businessHours' | 'pricingType'
> & {
  businessHours: BusinessHours[];
  pricingType?: PricingType;
};

export type UpdateEscapeRoom = Omit<
  UpdateEscapeRoomDTO,
  'businessHours' | 'pricingType'
> & {
  businessHours?: BusinessHours[];
  pricingType?: PricingType;
};

export type EscapeRoom = Omit<
  EscapeRoomDTO,
  'createdAt' | 'updatedAt' | 'businessHours' | 'pricingType'
> & {
  createdAt: Date;
  updatedAt: Date;
  businessHours: BusinessHours[];
  pricingType: PricingType;
};

export function fromEscapeRoomDTO(dto: EscapeRoomDTO): EscapeRoom {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    pricingType: dto.pricingType as PricingType
  };
}
