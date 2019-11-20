import { send } from 'micro';
import { get, post, put, AugmentedRequestHandler } from 'microrouter';
import { omit } from 'ramda';
import { CreateOrganizationDTO } from '../dto/CreateOrganizationDTO';
import { STATUS_SUCCESS, STATUS_ERROR } from '../lib/constants';
import { UpdateOrganizationDTO } from '../dto/UpdateOrganizationDTO';
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
  requireOrganization
} from '../helpers/organization';
import { getParams } from '../lib/utils/getParams';
import { getAuth } from '../lib/utils/getAuth';
import { getBody } from '../lib/utils/getBody';

const createOrganization: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const dto = await getBody(req, CreateOrganizationDTO);

  const belongsToOtherOrganization = await OrganizationMembershipModel.exists({
    user: userId
  });

  if (belongsToOtherOrganization) {
    // Temporarily disallow multiple memberships
    return send(res, STATUS_ERROR.FORBIDDEN);
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

  return send(res, STATUS_SUCCESS.OK, memberships);
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
    return send(res, STATUS_ERROR.NOT_FOUND);
  }

  return send(res, STATUS_SUCCESS.OK, organization);
};

const listBookings: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { organizationId } = getParams(req, ['organizationId']);

  const organization = await requireOrganization(organizationId);
  await requireBelongsToOrganization(organizationId, userId);

  const bookings = await BookingModel.find({
    escapeRoom: { $in: organization.escapeRooms },
    endDate: { $gt: new Date() }
  }).select('-escapeRoom');

  return send(res, STATUS_SUCCESS.OK, bookings);
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

  return send(
    res,
    STATUS_SUCCESS.OK,
    memberships.map(m => omit(['memberships'], m.toJSON()))
  );
};

const getOrganization: AugmentedRequestHandler = async (req, res) => {
  const { organizationId } = getParams(req, ['organizationId']);

  const organization = await OrganizationModel.findById(organizationId).select(
    '-members -escapeRooms'
  );

  if (!organization) {
    return send(res, STATUS_ERROR.NOT_FOUND);
  }

  return send(res, STATUS_SUCCESS.OK, organization);
};

export const organizationHandlers = [
  post('/organization', createOrganization),
  put('/organization/:organizationId', updateOrganization),
  get('/organization/:organizationId/booking', listBookings),
  get('/organization/:organizationId/member', listMembers),
  get('/organization/:organizationId', getOrganization) // TODO mark as public? no auth required
];
