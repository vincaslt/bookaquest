import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { EscapeRoom } from './EscapeRoom';

export enum BookingStatus {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Pending = 'PENDING'
}

export interface BookingInitFields {
  startDate: Date;
  endDate: Date;
  name: string;
  email: string;
  participants: number;
  phoneNumber: string;
  escapeRoom: string;
  status: BookingStatus;
  comment?: string;
}

export class Booking {
  @prop({ required: true })
  startDate: Date;

  @prop({ required: true })
  endDate: Date;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  participants: number;

  @prop({ required: true })
  phoneNumber: string;

  @prop()
  comment?: string;

  @prop({ required: true, ref: 'EscapeRoom' })
  escapeRoom: Ref<EscapeRoom>;

  @prop({ required: true })
  status: BookingStatus;
}

export const BookingModel = getModelForClass(Booking, {
  schemaOptions: { timestamps: true }
});
