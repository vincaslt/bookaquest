import { send } from 'micro';
import { get, post, put, AugmentedRequestHandler } from 'microrouter';
import { prop, uniqBy } from 'ramda';
import { CreateEscapeRoomDTO } from '../dto/CreateEscapeRoomDTO';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { isBetween } from '../helpers/number';
import { UpdateEscapeRoomDTO } from '../dto/UpdateEscapeRoomDTO';
import { EscapeRoomModel, EscapeRoomInitFields } from '../models/EscapeRoom';
import { OrganizationModel } from '../models/Organization';
import {
  requireBelongsToOrganization,
  requireEscapeRoomOrganization
} from '../helpers/organization';
import { getParams } from '../lib/utils/getParams';
import { getBody } from '../lib/utils/getBody';
import { getAuth } from '../lib/utils/getAuth';
import { requireEscapeRoom } from '../helpers/escapeRoom';

const createEscapeRoom: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { organizationId } = getParams(req, ['organizationId']);
  const dto = await getBody(req, CreateEscapeRoomDTO);

  const organization = await OrganizationModel.findById(organizationId);

  if (!organization) {
    return send(res, STATUS_ERROR.NOT_FOUND);
  }

  await requireBelongsToOrganization(organizationId, userId);

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
};

const updateEscapeRoom: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  const dto = await getBody(req, UpdateEscapeRoomDTO);

  const organization = await requireEscapeRoomOrganization(escapeRoomId);
  await requireBelongsToOrganization(organization.id, userId);

  const updatedEscapeRoom = await EscapeRoomModel.findOneAndUpdate(dto, {
    runValidators: true
  });

  if (!updatedEscapeRoom) {
    return send(res, STATUS_ERROR.INTERNAL);
  }

  return send(res, STATUS_SUCCESS.OK, updatedEscapeRoom);
};

const getEscapeRoom: AugmentedRequestHandler = async (req, res) => {
  const { escapeRoomId } = getParams(req, ['escapeRoomId']);
  return await requireEscapeRoom(escapeRoomId);
};

const listEscapeRooms: AugmentedRequestHandler = async (req, res) => {
  const { organizationId } = getParams(req, ['organizationId']);

  const organization = await OrganizationModel.findById(
    organizationId
  ).populate('escapeRooms');

  if (!organization) {
    return send(res, STATUS_ERROR.NOT_FOUND);
  }

  return organization.escapeRooms;
};

export const escapeRoomHandlers = [
  get('/organization/:organizationId/escape-room', listEscapeRooms), // TODO mark as public? No auth required
  post('/organization/:organizationId/escape-room', createEscapeRoom),
  get('/escape-room/:escapeRoomId', getEscapeRoom), // TODO mark as public?
  put('/escape-room/:escapeRoomId', updateEscapeRoom)
];
