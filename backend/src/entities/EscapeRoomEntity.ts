import { BookingEntity } from '@app/entities/BookingEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @OneToMany(type => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity[]

  @OneToMany(type => BookingEntity, booking => booking.escapeRoom)
  bookings: BookingEntity[]

  @Column('simple-array', { nullable: true })
  weekDays: number[]

  @Column('simple-array', { nullable: true })
  workHours: number[]

  @Column({ nullable: true })
  interval: number // in minutes

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
