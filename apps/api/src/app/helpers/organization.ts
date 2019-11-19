import { Ref } from '@typegoose/typegoose';
import { createError } from 'micro';
import { OrganizationMembershipModel } from '../models/OrganizationMembership';
import { STATUS_ERROR } from '../lib/constants';
import { OrganizationModel } from '../models/Organization';
import { EscapeRoom } from '../models/EscapeRoom';

export async function requireBelongsToOrganization(
  organization: string,
  user: string
) {
  const membershipExists = OrganizationMembershipModel.exists({
    organization,
    user
  });
  if (!membershipExists) {
    throw createError(
      STATUS_ERROR.FORBIDDEN,
      'Not a member of the organization'
    );
  }
}

export async function requireEscapeRoomOrganization(
  escapeRoom: string | Ref<EscapeRoom>
) {
  const organization = await OrganizationModel.findOne({
    escapeRooms: escapeRoom
  });

  if (!organization) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Organization not found');
  }

  return organization;
}
