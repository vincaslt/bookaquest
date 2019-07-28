import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  fullName: string

  @Column()
  password: string // TODO: rework to use secure remote password protocol

  @OneToMany(type => OrganizationMembershipEntity, membership => membership.user)
  memberships: OrganizationMembershipEntity[]

  @CreateDateColumn()
  createdAt: Date
}
