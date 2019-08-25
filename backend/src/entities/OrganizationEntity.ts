import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column('simple-array', { nullable: true })
  weekDays: number[]

  @Column('simple-array', { nullable: true })
  workHours: number[]

  @CreateDateColumn()
  createdAt: Date
}
