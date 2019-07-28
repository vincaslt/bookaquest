import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column()
  name: string

  @Column()
  website: string

  @OneToMany(type => OrganizationMembershipEntity, member => member.organization)
  members: OrganizationMembershipEntity[]

  @OneToMany(type => EscapeRoomEntity, escapeRoom => escapeRoom.organization)
  escapeRooms: EscapeRoomEntity[]

  @CreateDateColumn()
  createdAt: Date
}
