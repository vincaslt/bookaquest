import { createError } from 'micro';
import { get, post, put, AugmentedRequestHandler } from 'microrouter';
import { omit } from 'ramda';
import { Types } from 'mongoose';
import { CreateOrganizationDTO } from '../dto/CreateOrganizationDTO';
import { STATUS_ERROR } from '../lib/constants';
import { UpdateOrganizationDTO } from '../dto/UpdateOrganizationDTO';
import { CreateOrganizationInvitationDTO } from '../dto/CreateOrganizationInvitationDTO';
import {
  OrganizationModel,
  OrganizationInitFields
} from '../models/Organization';
import {
  OrganizationMembershipModel,
  OrganizationMembershipInitFields
} from '../models/OrganizationMembership';
import { BookingModel } from '../models/Booking';
import {
  requireBelongsToOrganization,
  requireOwnerOfOrganization,
  findUserMemberships,
  findUserInvitations
} from '../helpers/organization';
import { getParams } from '../lib/utils/getParams';
import { getAuth } from '../lib/utils/getAuth';
import { getBody } from '../lib/utils/getBody';
import { EscapeRoomModel } from '../models/EscapeRoom';
import {
  OrganizationInvitationModel,
  OrganizationInvitationInitFields,
  InvitationStatus
} from '../models/OrganizationInvitation';
import { UserModel } from '../models/User';

const createOrganization: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const dto = await getBody(req, CreateOrganizationDTO);

  const belongsToOtherOrganization = await OrganizationMembershipModel.exists({
    user: userId
  });

  if (belongsToOtherOrganization) {
    // TODO: remove when multiple memberships are allowed
    throw createError(
      STATUS_ERROR.FORBIDDEN,
      'User is already a member of an organization'
    );
  }

  const organizationFields: OrganizationInitFields = dto;
  const organization = await OrganizationModel.create(organizationFields);

  const membershipFields: OrganizationMembershipInitFields = {
    isOwner: true,
    organization: organization.id,
    user: userId
  };
  await OrganizationMembershipModel.create(membershipFields);

  const memberships = await OrganizationMembershipModel.find({
    user: userId
  }).select('-user');

  return memberships;
};

const updateOrganization: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { organizationId } = getParams(req, ['organizationId']);
  const dto = await getBody(req, UpdateOrganizationDTO);

  await requireBelongsToOrganization(organizationId, userId);

  const organization = await OrganizationModel.findByIdAndUpdate(
    organizationId,
    dto,
    { runValidators: true, new: true }
  ).select('-members -escapeRooms');

  if (!organization) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Organization not found');
  }

  return organization;
};

const listBookings: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { organizationId } = getParams(req, ['organizationId']);

  await requireBelongsToOrganization(organizationId, userId);

  const escapeRooms = await EscapeRoomModel.find({
    organization: organizationId
  });

  const bookings = await BookingModel.find({
    escapeRoom: { $in: escapeRooms.map(({ id }) => id) },
    endDate: { $gt: new Date() }
  });

  return bookings;
};

const listMembers: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { organizationId } = getParams(req, ['organizationId']);

  await requireBelongsToOrganization(organizationId, userId);

  const memberships = await OrganizationMembershipModel.find({
    organization: organizationId
  })
    .select('-organization')
    .populate('user');

  const invitations = await OrganizationInvitationModel.find({
    organization: organizationId
  })
    .select('-organization')
    .populate('user');

  return {
    invitations,
    memberships: memberships.map(m => omit(['memberships'], m.toJSON()))
  };
};

const getOrganization: AugmentedRequestHandler = async (req, res) => {
  const { organizationId } = getParams(req, ['organizationId']);

  const organization = await OrganizationModel.findById(organizationId).select(
    '-members -escapeRooms'
  );

  if (!organization) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Organization not found');
  }

  return organization;
};

const createOrganizationInvitation: AugmentedRequestHandler = async (
  req,
  res
) => {
  const { userId } = getAuth(req);
  const { organizationId } = getParams(req, ['organizationId']);
  const { email } = await getBody(req, CreateOrganizationInvitationDTO);

  await requireOwnerOfOrganization(organizationId, userId);
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  const isMemberOfAnyOrganization = await OrganizationMembershipModel.exists({
    user: user.id
  });

  // TODO: remove other organization check when support multiple organizations is added
  if (isMemberOfAnyOrganization) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'User already a member of an organization'
    );
  }

  const isAlreadyInvited = await OrganizationInvitationModel.exists({
    user: user.id,
    organization: organizationId
  });

  if (isAlreadyInvited) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'User is already invited to this organization'
    );
  }

  const invitationFields: OrganizationInvitationInitFields = {
    organization: organizationId,
    status: InvitationStatus.PENDING,
    user: user.id
  };

  await OrganizationInvitationModel.create(invitationFields);

  // TODO: send invitation email
};

const acceptOrganizationInvitation: AugmentedRequestHandler = async (
  req,
  res
) => {
  const { userId } = getAuth(req);
  const { invitationId } = getParams(req, ['invitationId']);

  const invitation = await OrganizationInvitationModel.findOne({
    _id: invitationId,
    user: userId,
    status: InvitationStatus.PENDING
  });

  if (!invitation) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Pending invitation not found');
  }

  invitation.status = InvitationStatus.ACCEPTED;
  const { organization } = await invitation.save();

  const membershipFields: OrganizationMembershipInitFields = {
    isOwner: false,
    organization: organization as Types.ObjectId,
    user: userId
  };

  await OrganizationMembershipModel.create(membershipFields);

  const [memberships, invitations] = await Promise.all([
    findUserMemberships(userId),
    findUserInvitations(userId)
  ]);

  return { memberships, invitations };
};

export const organizationHandlers = [
  post('/organization', createOrganization),
  put('/organization/:organizationId', updateOrganization),
  get('/organization/:organizationId/booking', listBookings),
  get('/organization/:organizationId/member', listMembers),
  post('/organization/:organizationId/member', createOrganizationInvitation),
  get('/organization/:organizationId', getOrganization), // TODO mark as public? no auth required
  post('/invitation/:invitationId/accept', acceptOrganizationInvitation)
];
