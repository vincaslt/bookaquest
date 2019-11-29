import { Ref, prop, getModelForClass } from '@typegoose/typegoose';
import { RefType } from '@typegoose/typegoose/lib/types';
import { User } from './User';
import { Organization } from './Organization';

export interface OrganizationMembershipInitFields {
  user: string;
  organization: RefType;
  isOwner: boolean;
}

export class OrganizationMembership {
  @prop({ ref: 'User', required: true })
  user: Ref<User>;

  @prop({ ref: 'Organization', required: true, index: true })
  organization: Ref<Organization>;

  @prop({ required: true })
  isOwner: boolean;
}

export const OrganizationMembershipModel = getModelForClass(
  OrganizationMembership,
  {
    schemaOptions: { timestamps: true, excludeIndexes: true }
  }
);
