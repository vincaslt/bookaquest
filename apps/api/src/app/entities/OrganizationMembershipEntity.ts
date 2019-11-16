import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { OrganizationEntity } from './OrganizationEntity';

// TODO: custom defined roles with defined set of privileges
@Entity({ name: 'organization_membership' })
export class OrganizationMembershipEntity {
  @Index()
  @PrimaryColumn()
  organizationId: string;

  @Index()
  @PrimaryColumn()
  userId: string;

  @Column()
  isOwner: boolean;

  @ManyToOne(() => UserEntity, user => user.memberships)
  user: UserEntity;

  @ManyToOne(() => OrganizationEntity, organization => organization.members)
  organization: OrganizationEntity;

  @CreateDateColumn()
  createdAt: Date;
}
