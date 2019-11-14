import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { EscapeRoomEntity } from './EscapeRoomEntity';

@Entity({ name: 'escape_room_business_hours' })
@Check('weekday >= 1')
@Check('weekday <= 7')
export class EscapeRoomBusinessHoursEntity {
  @Index()
  @PrimaryColumn()
  escapeRoomId: string;

  @Index()
  @PrimaryColumn()
  weekday: number;

  @ManyToOne(() => EscapeRoomEntity, escapeRoom => escapeRoom.businessHours, {
    cascade: true
  })
  escapeRoom: EscapeRoomEntity;

  @Column('numeric', { array: true, precision: 5, scale: 2, nullable: true })
  hours: number[];
}
