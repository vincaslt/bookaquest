import { Ref } from '@typegoose/typegoose';
import { RefType } from '@typegoose/typegoose/lib/types';
import { createError } from 'micro';
import { OrganizationMembershipModel } from '../models/OrganizationMembership';
import { STATUS_ERROR } from '../lib/constants';
import { OrganizationModel, Organization } from '../models/Organization';
import {
  InvitationStatus,
  OrganizationInvitationModel
} from '../models/OrganizationInvitation';

export async function requireOwnerOfOrganization(
  organization: string | Ref<Organization>,
  user: string
) {
  const membershipExists = await OrganizationMembershipModel.exists({
    organization,
    user,
    isOwner: true
  });
  if (!membershipExists) {
    throw createError(
      STATUS_ERROR.FORBIDDEN,
      'Not the owner of the organization'
    );
  }
}

export async function requireBelongsToOrganization(
  organization: string | Ref<Organization>,
  user: string
) {
  const membershipExists = await OrganizationMembershipModel.exists({
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

export async function requireOrganization(
  organizationId: string | Ref<Organization>
) {
  const organization = await OrganizationModel.findById(organizationId);
  if (!organization) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Organization not found');
  }
  return organization;
}

export async function findUserMemberships(user: RefType) {
  return await OrganizationMembershipModel.find({
    user
  }).select('-user');
}

export async function findUserInvitations(user: RefType) {
  return await OrganizationInvitationModel.find({
    user,
    status: InvitationStatus.PENDING
  }).populate('organization');
}

// TODO: rename stuff in frontend - user invitation (in user), organization invitation (in org)
export async function findOrganizationInvitations(organization: RefType) {
  return await OrganizationInvitationModel.find({
    organization
  })
    .select('-organization')
    .populate('user');
}
