import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

export interface RefreshTokenInitFields {
  user: string;
  token: string;
  expirationDate: Date;
}

export class RefreshToken {
  @prop({ required: true, ref: 'User', index: true })
  user: Ref<User>;

  @prop({ required: true })
  token: string;

  @prop({ required: true })
  expirationDate: Date;
}

export const RefreshTokenModel = getModelForClass(RefreshToken, {
  schemaOptions: { timestamps: true }
});
