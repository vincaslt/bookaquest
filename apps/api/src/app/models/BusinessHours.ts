import { prop, arrayProp } from '@typegoose/typegoose';

// TODO: validation, weekday >= 1 && weekday <= 7
export class BusinessHours {
  @prop({ required: true })
  weekday: number;

  @arrayProp({ items: Number })
  hours: number[];
}
