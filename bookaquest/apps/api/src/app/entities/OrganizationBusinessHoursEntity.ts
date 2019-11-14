import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { OrganizationEntity } from './OrganizationEntity';

@Entity({ name: 'organization_business_hours' })
@Check('weekday >= 1')
@Check('weekday <= 7')
export class OrganizationBusinessHoursEntity {
  @Index()
  @PrimaryColumn()
  organizationId: string;

  @Index()
  @PrimaryColumn()
  weekday: number;

  @ManyToOne(
    () => OrganizationEntity,
    organization => organization.businessHours
  )
  organization: OrganizationEntity;

  @Column('numeric', { array: true, precision: 5, scale: 2, nullable: true })
  hours: number[];
}
