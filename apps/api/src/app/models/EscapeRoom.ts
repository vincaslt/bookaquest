import {
  prop,
  arrayProp,
  getModelForClass,
  DocumentType
} from '@typegoose/typegoose';
import { BusinessHours } from './BusinessHours';
import { OrganizationModel } from './Organization';

export enum PricingType {
  PER_PERSON = 'per_person',
  FLAT = 'flat'
}

export interface EscapeRoomInitFields {
  name: string;
  description: string;
  pricingType: PricingType;
  price: number;
  participants: [number, number];
  location: string;
  interval: number;
  difficulty: number;
  images: string[];
  businessHours: BusinessHours[];
  timezone?: string;
  paymentEnabled?: boolean;
}

export class EscapeRoom {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  pricingType: PricingType;

  @prop({ required: true })
  price: number;

  @arrayProp({ items: Number, required: true })
  participants: [number, number];

  @prop({ required: true })
  location: string;

  @arrayProp({ items: String, required: true }) // TODO: http* will load directly /images* will load from storage
  images: string[];

  @arrayProp({ required: true, items: BusinessHours, _id: false })
  businessHours: BusinessHours[];

  @prop()
  timezone?: string;

  @prop({ required: true })
  interval: number; // in minutes

  // TODO: 1-5 validation
  @prop()
  difficulty: number;

  @prop({ default: false })
  paymentEnabled: boolean;

  public getOrganization(this: DocumentType<EscapeRoom>) {
    return OrganizationModel.findOne({ escapeRooms: this.id });
  }
}

export const EscapeRoomModel = getModelForClass(EscapeRoom, {
  schemaOptions: { timestamps: true }
});