import { getRepository } from 'typeorm';
import { OrganizationMembershipEntity } from '../entities/OrganizationMembershipEntity';

export async function isOrganizationMember(
  organizationId: string,
  userId: string
) {
  const organizationMembershipRepo = getRepository(
    OrganizationMembershipEntity
  );

  const membership = await organizationMembershipRepo.findOne({
    where: { userId, organizationId }
  });

  return !!membership;
}
