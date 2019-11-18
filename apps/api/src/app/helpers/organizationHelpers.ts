import { OrganizationMembershipModel } from '../models/OrganizationMembership';

export async function isOrganizationMember(organization: string, user: string) {
  return OrganizationMembershipModel.exists({
    organization,
    user
  });
}
