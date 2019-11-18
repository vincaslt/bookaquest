import { Ref, prop, getModelForClass } from '@typegoose/typegoose';
import { User } from './User';
import { Organization } from './Organization';

export interface OrganizationMembershipInitFields {
  user: string;
  organization: string;
  isOwner: boolean;
}

export class OrganizationMembership {
  @prop({ ref: 'User', required: true })
  user: Ref<User>;

  @prop({ ref: 'Organization', required: true, select: false, index: true })
  organization: Ref<Organization>;

  @prop({ required: true })
  isOwner: boolean;
}

export const OrganizationMembershipModel = getModelForClass(
  OrganizationMembership,
  {
    schemaOptions: { timestamps: true }
  }
);
