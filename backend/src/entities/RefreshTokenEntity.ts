import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class RefreshTokenEntity {
  @PrimaryColumn({ length: 256 })
  token: string

  @Column()
  userId: string

  @Column()
  expirationDate: Date

  @CreateDateColumn()
  issueDate: Date
}
