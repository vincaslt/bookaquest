import { prop, arrayProp, getModelForClass, Ref } from '@typegoose/typegoose';
import { BusinessHours } from './BusinessHours';
import { Organization } from './Organization';

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
  organization: string;
  timezone?: string;
  paymentEnabled?: boolean;
}

// TODO: Classify parameters into PaymentInfo (price, type), BookingDetails (participants, interval) to copy into booking
export class EscapeRoom {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  pricingType: PricingType;

  @prop({ required: true })
  price: number; // TODO: store in stripe price format (x100)

  @arrayProp({ items: Number, required: true })
  participants: [number, number];

  @prop({ required: true })
  location: string;

  @arrayProp({ items: String, required: true }) // TODO: http* will load directly /images* will load from storage
  images: string[];

  @arrayProp({ required: true, items: BusinessHours, _id: false })
  businessHours: BusinessHours[];

  @prop({ ref: 'Organization', required: true })
  organization: Ref<Organization>;

  @prop()
  timezone?: string;

  @prop({ required: true })
  interval: number; // in minutes

  // TODO: 1-5 validation
  @prop({ required: true })
  difficulty: number;

  @prop({ default: false })
  paymentEnabled: boolean;

  @prop({ default: false, select: false, index: true })
  deleted: boolean;
}

export const EscapeRoomModel = getModelForClass(EscapeRoom, {
  schemaOptions: { timestamps: true }
});
