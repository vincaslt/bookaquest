import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn
} from 'typeorm';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryColumn({ length: 256 })
  token: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  expirationDate: Date;

  @CreateDateColumn()
  issueDate: Date;
}
