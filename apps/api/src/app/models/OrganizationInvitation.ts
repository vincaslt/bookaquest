import { Ref, prop, getModelForClass } from '@typegoose/typegoose';
import { User } from './User';
import { Organization } from './Organization';

export enum InvitationStatus {
  PENDING = 'pending',
  DECLINED = 'declined',
  ACCEPTED = 'accepted'
}

export interface OrganizationInvitationInitFields {
  user: string;
  organization: string;
  status: InvitationStatus;
}

export class OrganizationInvitation {
  @prop({ ref: 'User', required: true })
  user: Ref<User>;

  @prop({ ref: 'Organization', required: true, index: true })
  organization: Ref<Organization>;

  @prop({ required: true })
  status: InvitationStatus;
}

export const OrganizationInvitationModel = getModelForClass(
  OrganizationInvitation,
  {
    schemaOptions: { timestamps: true }
  }
);
