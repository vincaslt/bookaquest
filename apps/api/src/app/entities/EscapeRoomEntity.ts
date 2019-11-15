import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { OrganizationEntity } from './OrganizationEntity';
import { BookingEntity } from './BookingEntity';
import { EscapeRoomBusinessHoursEntity } from './EscapeRoomBusinessHoursEntity';

export enum PricingType {
  PER_PERSON = 'per_person',
  FLAT = 'flat'
}

@Entity({ name: 'escape_room' })
export class EscapeRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  organizationId: string;

  @Column('enum', { enum: PricingType, default: PricingType.FLAT })
  pricingType: PricingType;

  @Column('numeric', { precision: 5, scale: 2 })
  price: number;

  @Column('numeric', { array: true })
  participants: [number, number];

  @Column()
  location: string;

  @Column('varchar', { array: true }) // TODO: http* will load directly /images* will load from storage
  images: string[];

  @ManyToOne(() => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity;

  @OneToMany(() => BookingEntity, booking => booking.escapeRoom)
  bookings: BookingEntity[];

  @OneToMany(
    () => EscapeRoomBusinessHoursEntity,
    businessHours => businessHours.escapeRoom
  )
  businessHours: EscapeRoomBusinessHoursEntity[];

  @Column({ nullable: true })
  timezone?: string;

  @Column()
  interval: number; // in minutes

  @Column()
  difficulty: number; // 1-5

  @Column({ default: false })
  paymentEnabled: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
