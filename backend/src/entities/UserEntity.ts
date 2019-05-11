import { Column, CreateDateColumn, Entity, Index,PrimaryGeneratedColumn } from 'typeorm'

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

  @CreateDateColumn()
  createdAt: Date
}
