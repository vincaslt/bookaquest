import { BookingEntity } from '@app/entities/BookingEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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

  @OneToMany(type => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity[]

  @OneToMany(type => BookingEntity, booking => booking.escapeRoom)
  bookings: BookingEntity[]

  @CreateDateColumn()
  createdAt: Date
}
