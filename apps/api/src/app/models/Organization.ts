import { prop, arrayProp, getModelForClass } from '@typegoose/typegoose';
import { BusinessHours } from './BusinessHours';

export class PaymentDetails {
  @prop({ required: true, select: false })
  paymentSecretKey: string;

  @prop({ required: true })
  paymentClientKey: string;
}

export interface OrganizationInitFields {
  name: string;
  website?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
  timezone?: string;
  paymentDetails?: PaymentDetails;
  businessHours?: BusinessHours[];
}

export class Organization {
  @prop({ required: true, unique: true })
  name: string;

  @prop()
  website?: string;

  @prop()
  location?: string;

  @prop()
  phoneNumber?: string;

  @prop()
  email?: string;

  @prop()
  timezone?: string;

  @prop({ _id: false })
  paymentDetails?: PaymentDetails;

  @arrayProp({ items: BusinessHours, _id: false })
  businessHours?: BusinessHours[];
}

export const OrganizationModel = getModelForClass(Organization, {
  schemaOptions: { timestamps: true }
});
