import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class EscapeRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  organizationId: string

  @OneToMany(type => OrganizationEntity, organization => organization.escapeRooms)
  organization: OrganizationEntity[]

  @CreateDateColumn()
  createdAt: Date
}
