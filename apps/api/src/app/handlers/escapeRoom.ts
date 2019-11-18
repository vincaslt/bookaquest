import { send } from 'micro';
import { get, post, put } from 'microrouter';
import { prop, uniqBy } from 'ramda';
import { withAuth } from '../lib/decorators/withAuth';
import { withParams } from '../lib/decorators/withParams';
import { withBody } from '../lib/decorators/withBody';
import { CreateEscapeRoomDTO } from '../dto/CreateEscapeRoomDTO';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { isOrganizationMember } from '../helpers/organizationHelpers';
import { isBetween } from '../helpers/number';
import { UpdateEscapeRoomDTO } from '../dto/UpdateEscapeRoomDTO';
import { EscapeRoomModel, EscapeRoomInitFields } from '../models/EscapeRoom';
import { OrganizationModel } from '../models/Organization';

const createEscapeRoom = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(CreateEscapeRoomDTO, dto => async (req, res) => {
      const organization = await OrganizationModel.findById(organizationId);

      if (!organization) {
        return send(res, STATUS_ERROR.NOT_FOUND);
      }

      const isMember = await isOrganizationMember(organization.id, userId);

      if (!isMember) {
        return send(res, STATUS_ERROR.FORBIDDEN);
      }

      const hasDuplicateWeekday =
        uniqBy(prop('weekday'), dto.businessHours).length !==
        dto.businessHours.length;
      const badHoursFormat = dto.businessHours.some(
        ({ hours, weekday }) =>
          hours.some(hour => !isBetween(hour, [0, 24])) ||
          !isBetween(weekday, [1, 7])
      );

      if (hasDuplicateWeekday || badHoursFormat) {
        return send(res, STATUS_ERROR.BAD_REQUEST);
      }

      const escapeRoomFields: EscapeRoomInitFields = dto;
      const escapeRoom = await EscapeRoomModel.create(escapeRoomFields);
      organization.escapeRooms.push(escapeRoom.id);
      await organization.save();

      return send(res, STATUS_SUCCESS.OK, escapeRoom);
    })
  )
);

const updateEscapeRoom = withAuth(({ userId }) =>
  withParams(['escapeRoomId'], ({ escapeRoomId }) =>
    withBody(UpdateEscapeRoomDTO, dto => async (req, res) => {
      const escapeRoom = await EscapeRoomModel.findById(escapeRoomId);

      if (!escapeRoom) {
        return send(res, STATUS_ERROR.NOT_FOUND);
      }

      const organization = await escapeRoom.getOrganization();

      if (!organization) {
        return send(res, STATUS_ERROR.NOT_FOUND);
      }

      const isMember = await isOrganizationMember(organization.id, userId);

      if (!isMember) {
        return send(res, STATUS_ERROR.FORBIDDEN);
      }

      const updatedEscapeRoom = await EscapeRoomModel.findOneAndUpdate(dto, {
        runValidators: true
      });

      if (!updatedEscapeRoom) {
        return send(res, STATUS_ERROR.INTERNAL);
      }

      return send(res, STATUS_SUCCESS.OK, updatedEscapeRoom);
    })
  )
);

const getEscapeRoom = withParams(
  ['escapeRoomId'],
  ({ escapeRoomId }) => async (req, res) => {
    const escapeRoom = await EscapeRoomModel.findById(escapeRoomId);

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    return escapeRoom;
  }
);

const listEscapeRooms = withParams(
  ['organizationId'],
  ({ organizationId }) => async (req, res) => {
    const organization = await OrganizationModel.findById(
      organizationId
    ).populate('escapeRooms');

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    return organization.escapeRooms;
  }
);

export const escapeRoomHandlers = [
  get('/organization/:organizationId/escape-room', listEscapeRooms), // TODO mark as public? No auth required
  post('/organization/:organizationId/escape-room', createEscapeRoom),
  get('/escape-room/:escapeRoomId', getEscapeRoom), // TODO mark as public?
  put('/escape-room/:escapeRoomId', updateEscapeRoom)
];
