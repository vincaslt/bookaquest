import { prop, getModelForClass, arrayProp, Ref } from '@typegoose/typegoose';
import { OrganizationMembership } from './OrganizationMembership';

export class UserInitFields {
  email: string;
  fullName: string;
  password: string;
}

export class User {
  @prop({ required: true, unique: true, index: true })
  email: string;

  @prop({ required: true })
  fullName: string;

  @prop({ required: true, select: false })
  password: string;

  @arrayProp({ ref: 'OrganizationMembership' })
  memberships: Ref<OrganizationMembership>[]; // TODO: convert into insatnceMethod
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
});
