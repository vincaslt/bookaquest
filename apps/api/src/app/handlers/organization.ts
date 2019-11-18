import { send } from 'micro';
import { get, post, put } from 'microrouter';
import { omit } from 'ramda';
import { withAuth } from '../lib/decorators/withAuth';
import { withBody } from '../lib/decorators/withBody';
import { CreateOrganizationDTO } from '../dto/CreateOrganizationDTO';
import { STATUS_SUCCESS, STATUS_ERROR } from '../lib/constants';
import { withParams } from '../lib/decorators/withParams';
import { UpdateOrganizationDTO } from '../dto/UpdateOrganizationDTO';
import { isOrganizationMember } from '../helpers/organizationHelpers';
import {
  OrganizationModel,
  OrganizationInitFields
} from '../models/Organization';
import {
  OrganizationMembershipModel,
  OrganizationMembershipInitFields
} from '../models/OrganizationMembership';
import { BookingModel } from '../models/Booking';

const createOrganization = withAuth(({ userId }) =>
  withBody(CreateOrganizationDTO, dto => async (req, res) => {
    const belongsToOrganization = await OrganizationMembershipModel.exists({
      user: userId
    });

    if (belongsToOrganization) {
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
    });

    return send(res, STATUS_SUCCESS.OK, memberships);
  })
);

const updateOrganization = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(UpdateOrganizationDTO, dto => async (req, res) => {
      const isMember = await isOrganizationMember(organizationId, userId);

      if (!isMember) {
        return send(res, STATUS_ERROR.FORBIDDEN);
      }

      const organization = await OrganizationModel.findByIdAndUpdate(
        organizationId,
        dto,
        { runValidators: true }
      ).select('-members -escapeRooms');

      if (!organization) {
        return send(res, STATUS_ERROR.NOT_FOUND);
      }

      return send(res, STATUS_SUCCESS.OK, organization);
    })
  )
);

const listBookings = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) => async (req, res) => {
    const isMember = await isOrganizationMember(organizationId, userId);

    if (!isMember) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    }

    const organization = await OrganizationModel.findById(organizationId);

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    const bookings = await BookingModel.find({
      escapeRoom: { $in: organization.escapeRooms },
      endDate: { $gt: new Date() }
    }).select('-escapeRoom');

    return send(res, STATUS_SUCCESS.OK, bookings);
  })
);

const listMembers = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) => async (req, res) => {
    const isMember = await isOrganizationMember(organizationId, userId);

    if (!isMember) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    }

    const memberships = await OrganizationMembershipModel.find({
      organization: organizationId
    }).populate('user');

    return send(res, STATUS_SUCCESS.OK, memberships.map(omit(['memberships'])));
  })
);

const getOrganization = withParams(
  ['organizationId'],
  ({ organizationId }) => async (req, res) => {
    const organization = await OrganizationModel.findById(
      organizationId
    ).select('-members -escapeRooms');

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    return send(res, STATUS_SUCCESS.OK, organization);
  }
);

export const organizationHandlers = [
  post('/organization', createOrganization),
  put('/organization/:organizationId', updateOrganization),
  get('/organization/:organizationId/booking', listBookings),
  get('/organization/:organizationId/member', listMembers),
  get('/organization/:organizationId', getOrganization) // TODO mark as public? no auth required
];
