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

  // @Column({ select: false })
  @Column() // TODO: enable when select is fixed
  password: string // TODO: rework to use secure remote password protocol

  // TODO: setup cascade deletes
  @OneToMany(type => OrganizationMembershipEntity, membership => membership.user)
  memberships: OrganizationMembershipEntity[]

  @CreateDateColumn()
  createdAt: Date
}
