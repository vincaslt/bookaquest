import { prop, Ref, arrayProp, getModelForClass } from '@typegoose/typegoose';
import { BusinessHours } from './BusinessHours';
import { EscapeRoom } from './EscapeRoom';
import { OrganizationMembership } from './OrganizationMembership';

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
  timezone?: string;

  @prop({ _id: false })
  paymentDetails?: PaymentDetails;

  @arrayProp({ items: BusinessHours, _id: false })
  businessHours?: BusinessHours[];

  @arrayProp({ ref: 'OrganizationMembership' })
  members: Ref<OrganizationMembership>[]; // TODO: convert into instance method

  @arrayProp({ ref: 'EscapeRoom', index: true })
  escapeRooms: Ref<EscapeRoom>[];
}

export const OrganizationModel = getModelForClass(Organization, {
  schemaOptions: { timestamps: true }
});
