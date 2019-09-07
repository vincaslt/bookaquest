import { BookingEntity } from '@app/entities/BookingEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'escape_room' })
export class EscapeRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  organizationId: string

  @Column()
  location: string

  @ManyToOne(type => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity

  @OneToMany(type => BookingEntity, booking => booking.escapeRoom)
  bookings: BookingEntity[]

  @Column('integer', { array: true, nullable: true })
  weekDays: number[]

  @Column('integer', { array: true, nullable: true })
  workHours: number[]

  @Column({ nullable: true })
  interval: number // in minutes

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
