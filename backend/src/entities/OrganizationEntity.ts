import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { OrganizationBusinessHoursEntity } from '@app/entities/OrganizationBusinessHoursEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { PaymentDetailsEntity } from '@app/entities/PaymentDetailsEntity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'organization' })
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column()
  name: string

  @Column()
  website: string

  @Column()
  location: string

  @OneToMany(type => OrganizationMembershipEntity, member => member.organization)
  members: OrganizationMembershipEntity[]

  @OneToMany(type => EscapeRoomEntity, escapeRoom => escapeRoom.organization)
  escapeRooms: EscapeRoomEntity[]

  @OneToMany(type => OrganizationBusinessHoursEntity, businessHours => businessHours.organization)
  businessHours: OrganizationBusinessHoursEntity[]

  @OneToOne(type => PaymentDetailsEntity, paymentDetails => paymentDetails.organization, {
    nullable: true
  })
  paymentDetails?: PaymentDetailsEntity

  @Column({ nullable: true })
  timezone?: string

  @CreateDateColumn()
  createdAt: Date
}
