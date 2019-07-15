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

  // TODO: owner

  @CreateDateColumn()
  createdAt: Date
}
