import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { Check, Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity({ name: 'escape_room_business_hours' })
@Check('weekday >= 1')
@Check('weekday <= 7')
export class EscapeRoomBusinessHoursEntity {
  @Index()
  @PrimaryColumn()
  escapeRoomId: string

  @Index()
  @PrimaryColumn()
  weekday: number

  @ManyToOne(type => EscapeRoomEntity, escapeRoom => escapeRoom.businessHours, {
    cascade: true
  })
  escapeRoom: EscapeRoomEntity

  @Column('numeric', { array: true, precision: 5, scale: 2, nullable: true })
  hours: number[]
}
