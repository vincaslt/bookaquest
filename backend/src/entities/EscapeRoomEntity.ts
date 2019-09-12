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

  @Column('numeric', { precision: 5, scale: 2 })
  price: number

  @Column()
  location: string

  @Column('varchar', { array: true }) // TODO: http* will load directly /images* will load from storage
  images: string[]

  @ManyToOne(type => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity

  @OneToMany(type => BookingEntity, booking => booking.escapeRoom)
  bookings: BookingEntity[]

  @Column('integer', { array: true })
  weekDays: number[]

  @Column('numeric', { precision: 5, scale: 1, array: true })
  workHours: number[]

  @Column()
  interval: number // in minutes

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
