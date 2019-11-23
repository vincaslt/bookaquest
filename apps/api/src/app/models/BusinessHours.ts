import { prop, arrayProp } from '@typegoose/typegoose';

// TODO: validation, weekday >= 0 (sunday) && weekday <= 6
export class BusinessHours {
  @prop({ required: true })
  weekday: number;

  @arrayProp({ items: Number })
  hours: number[];
}
