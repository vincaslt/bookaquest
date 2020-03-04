import { prop, getModelForClass } from '@typegoose/typegoose';

export class UserInitFields {
  email: string;
  fullName: string;
  password: string;
  verificationCode: string;
}

export class User {
  @prop({ required: true, unique: true, index: true })
  email: string;

  @prop({ required: true })
  fullName: string;

  @prop({ required: true, default: false })
  verified: boolean;

  @prop({ required: true, select: false })
  verificationCode: string;

  @prop({ required: true, select: false })
  password: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
});
