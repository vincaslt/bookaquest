import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @Column('simple-array')
  weekDays: number[]

  @Column('simple-array')
  workHours: number[]

  // @ManyToOne(type => UserEntity, user => user.schedules)
  // owner: UserEntity

  @Column()
  ownerId: string

  @CreateDateColumn()
  createdAt: Date
}
