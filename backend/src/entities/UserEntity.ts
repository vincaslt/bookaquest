import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user' })
export class UserEntity {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ unique: true })
  email: string

  @Column()
  fullName: string

  @Column() // TODO: not select it by default
  password: string // TODO: rework to use secure remote password protocol

  @OneToMany(type => OrganizationMembershipEntity, membership => membership.user)
  memberships: OrganizationMembershipEntity[]

  @CreateDateColumn()
  createdAt: Date
}
