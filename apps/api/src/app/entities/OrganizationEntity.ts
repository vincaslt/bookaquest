import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { OrganizationMembershipEntity } from './OrganizationMembershipEntity';
import { EscapeRoomEntity } from './EscapeRoomEntity';
import { OrganizationBusinessHoursEntity } from './OrganizationBusinessHoursEntity';
import { PaymentDetailsEntity } from './PaymentDetailsEntity';

@Entity({ name: 'organization' })
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column()
  name: string;

  @Column()
  website: string;

  @Column()
  location: string;

  @OneToMany(() => OrganizationMembershipEntity, member => member.organization)
  members: OrganizationMembershipEntity[];

  @OneToMany(() => EscapeRoomEntity, escapeRoom => escapeRoom.organization)
  escapeRooms: EscapeRoomEntity[];

  @OneToMany(
    () => OrganizationBusinessHoursEntity,
    businessHours => businessHours.organization
  )
  businessHours: OrganizationBusinessHoursEntity[];

  @OneToOne(
    () => PaymentDetailsEntity,
    paymentDetails => paymentDetails.organization,
    {
      nullable: true
    }
  )
  paymentDetails?: PaymentDetailsEntity;

  @Column({ nullable: true })
  timezone?: string;

  @CreateDateColumn()
  createdAt: Date;
}
