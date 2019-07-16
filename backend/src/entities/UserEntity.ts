import { ScheduleEntity } from '@app/entities/ScheduleEntity'
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
  password: string

  @OneToMany(type => ScheduleEntity, schedule => schedule.owner)
  schedules: ScheduleEntity[]

  @CreateDateColumn()
  createdAt: Date
}
