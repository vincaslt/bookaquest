import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { EscapeRoomEntity } from './EscapeRoomEntity';

export enum BookingStatus {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Pending = 'PENDING'
}

@Entity({ name: 'booking' })
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column('timestamptz')
  startDate: Date;

  @Column('timestamptz')
  endDate: Date;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  participants: number;

  @Column()
  phoneNumber: string;

  @Column()
  escapeRoomId: string;

  @Column({ nullable: true })
  comment?: string;

  @Column('enum', { enum: BookingStatus })
  status: BookingStatus;

  @ManyToOne(() => EscapeRoomEntity, escapeRoom => escapeRoom.bookings)
  escapeRoom: EscapeRoomEntity;

  @CreateDateColumn()
  createdAt: Date;
}
