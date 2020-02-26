import { prop, arrayProp } from '@typegoose/typegoose';

export class BusinessHours {
  @prop({ required: true, min: 1, max: 7 })
  weekday: number;

  @arrayProp({ items: Number, min: 0, max: 24 })
  hours: number[]; // TODO: rework into an object
}
