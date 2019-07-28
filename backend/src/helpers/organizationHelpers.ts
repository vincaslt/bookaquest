import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { getRepository } from 'typeorm'

export async function isOrganizationMember(organizationId: string, userId: string) {
  const organizationMembershipRepo = getRepository(OrganizationMembershipEntity)

  const membership = await organizationMembershipRepo.findOne({
    where: { userId, organizationId }
  })

  return !!membership
}
