import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'payment_details' })
export class PaymentDetailsEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  // @Column({ select: false }) // TODO: enable when select is fixed
  @Column()
  paymentSecretKey: string

  @Column()
  paymentClientKey: string

  @Column()
  organizationId: string

  @OneToOne(type => OrganizationEntity, organization => organization.paymentDetails)
  @JoinColumn()
  organization: OrganizationEntity
}
