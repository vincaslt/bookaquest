import { BookingEntity } from '@app/entities/BookingEntity'
import { EscapeRoomBusinessHoursEntity } from '@app/entities/EscapeRoomBusinessHoursEntity'
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

export enum PricingType {
  PER_PERSON = 'per_person',
  FLAT = 'flat'
}

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

  @Column('enum', { enum: PricingType, default: PricingType.FLAT })
  pricingType: PricingType

  @Column('numeric', { precision: 5, scale: 2 })
  price: number

  @Column('numeric', { array: true })
  participants: [number, number]

  @Column()
  location: string

  @Column('varchar', { array: true }) // TODO: http* will load directly /images* will load from storage
  images: string[]

  @ManyToOne(type => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity

  @OneToMany(type => BookingEntity, booking => booking.escapeRoom)
  bookings: BookingEntity[]

  @OneToMany(type => EscapeRoomBusinessHoursEntity, businessHours => businessHours.escapeRoom)
  businessHours: EscapeRoomBusinessHoursEntity[]

  @Column({ nullable: true })
  timezone?: string

  @Column()
  interval: number // in minutes

  @Column()
  difficulty: number // 1-5

  @Column({ default: false })
  paymentEnabled: boolean

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
