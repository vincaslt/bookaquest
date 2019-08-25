import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm'

// TODO: custom defined roles with defined set of privileges
@Entity({ name: 'organization_membership' })
export class OrganizationMembershipEntity {
  @Index()
  @PrimaryColumn()
  organizationId: string

  @Index()
  @PrimaryColumn()
  userId: string

  @Column()
  isOwner: boolean

  @ManyToOne(type => UserEntity, user => user.memberships)
  user: UserEntity

  @ManyToOne(type => OrganizationEntity, organization => organization.members)
  organization: OrganizationEntity

  @CreateDateColumn()
  createdAt: Date
}
