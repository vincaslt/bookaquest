import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'

@Entity({ name: 'booking' })
@Unique('UQ_TIMESLOT', ['startDate', 'endDate', 'escapeRoomId'])
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column({ type: 'datetime' })
  startDate: Date

  @Column({ type: 'datetime' })
  endDate: Date

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  phoneNumber: string

  @Column()
  escapeRoomId: string

  @ManyToOne(type => EscapeRoomEntity, escapeRoom => escapeRoom.bookings)
  escapeRoom: EscapeRoomEntity

  @CreateDateColumn()
  createdAt: Date
}
