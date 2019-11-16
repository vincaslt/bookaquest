import { getManager, getRepository, MoreThan } from 'typeorm';
import { send } from 'micro';
import { get, post, put } from 'microrouter';
import { prop, uniqBy } from 'ramda';
import { withAuth } from '../lib/decorators/withAuth';
import { withParams } from '../lib/decorators/withParams';
import { withBody } from '../lib/decorators/withBody';
import { CreateEscapeRoomDTO } from '../dto/CreateEscapeRoomDTO';
import { OrganizationEntity } from '../entities/OrganizationEntity';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { isOrganizationMember } from '../helpers/organizationHelpers';
import { isBetween } from '../helpers/number';
import { EscapeRoomEntity } from '../entities/EscapeRoomEntity';
import { EscapeRoomBusinessHoursEntity } from '../entities/EscapeRoomBusinessHoursEntity';
import { toEscapeRoomDTO } from '../dto/EscapeRoomDTO';
import { UpdateEscapeRoomDTO } from '../dto/UpdateEscapeRoomDTO';
import { BookingEntity } from '../entities/BookingEntity';
import { toBookingDTO } from '../dto/BookingDTO';

// TODO: Escape room interval missing
// TODO: check organization escape room limits, how many it has already
const createEscapeRoom = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(CreateEscapeRoomDTO, dto => async (req, res) => {
      const organizationRepo = getRepository(OrganizationEntity);

      // TODO: util method to get with relation and check existance, return monad
      const organization = await organizationRepo.findOne(organizationId);

      if (!organization) {
        return send(res, STATUS_ERROR.NOT_FOUND);
      }

      // TODO: check permissions when implemented
      if (!isOrganizationMember(organizationId, userId)) {
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

      try {
        const savedRoom = await getManager().transaction(async trans => {
          const transEscapeRoomRepo = trans.getRepository(EscapeRoomEntity);
          const transBusinessHoursRepo = trans.getRepository(
            EscapeRoomBusinessHoursEntity
          );

          const newEscapeRoom = transEscapeRoomRepo.create({
            ...dto,
            organizationId
          });
          const escapeRoom = await transEscapeRoomRepo.save(newEscapeRoom);

          const businessHours = transBusinessHoursRepo.create(
            dto.businessHours.map(hours => ({
              escapeRoomId: escapeRoom.id,
              ...hours
            }))
          );
          await transBusinessHoursRepo.save(businessHours);
          return escapeRoom;
        });

        return send(res, STATUS_SUCCESS.OK, toEscapeRoomDTO(savedRoom));
      } catch (e) {
        // TODO: logging
        return send(res, STATUS_ERROR.INTERNAL);
      }
    })
  )
);

const updateEscapeRoom = withAuth(({ userId }) =>
  withParams(['escapeRoomId'], ({ escapeRoomId }) =>
    withBody(UpdateEscapeRoomDTO, dto => async (req, res) => {
      const escapeRoomRepo = getRepository(EscapeRoomEntity);
      const escapeRoom = await escapeRoomRepo.findOne(escapeRoomId);

      if (!escapeRoom) {
        return send(res, STATUS_ERROR.NOT_FOUND);
      }

      // TODO: check permissions when implemented
      if (!isOrganizationMember(escapeRoom.organizationId, userId)) {
        return send(res, STATUS_ERROR.FORBIDDEN);
      }

      try {
        await getManager().transaction(async trans => {
          const transEscapeRoomRepo = trans.getRepository(EscapeRoomEntity);
          const transBusinessHoursRepo = trans.getRepository(
            EscapeRoomBusinessHoursEntity
          );

          const options = {
            ...dto,
            id: escapeRoomId
          };

          if (dto.businessHours) {
            await transBusinessHoursRepo.remove(escapeRoom.businessHours);

            options.businessHours = transBusinessHoursRepo.create(
              dto.businessHours.map(hours => ({
                ...hours,
                escapeRoomId: escapeRoom.id
              }))
            );
          }

          const updatedEscapeRoom = await transEscapeRoomRepo.preload(options);

          if (!updatedEscapeRoom) {
            throw new Error('Escape room not found');
          }

          await transEscapeRoomRepo.save(updatedEscapeRoom);
          if (options.businessHours) {
            await transBusinessHoursRepo.save(options.businessHours);
          }
        });

        const savedEscapeRoom = await escapeRoomRepo.findOne(escapeRoomId, {
          relations: ['businessHours']
        });

        return send(
          res,
          STATUS_SUCCESS.OK,
          savedEscapeRoom && toEscapeRoomDTO(savedEscapeRoom)
        );
      } catch (e) {
        return send(res, STATUS_ERROR.INTERNAL);
      }
    })
  )
);

const getEscapeRoom = withParams(
  ['escapeRoomId'],
  ({ escapeRoomId }) => async () => {
    const escapeRoomRepo = getRepository(EscapeRoomEntity);

    const organizationEscapeRoom = await escapeRoomRepo.findOne(escapeRoomId, {
      relations: ['businessHours']
    });

    return organizationEscapeRoom && toEscapeRoomDTO(organizationEscapeRoom);
  }
);

// TODO: query param to get only the ones with working hours
// TODO: separate private endpoint to get bookings
// TODO: separate public endpoint to get availability
const listEscapeRooms = withParams(
  ['organizationId'],
  ({ organizationId }) => async () => {
    const escapeRoomRepo = getRepository(EscapeRoomEntity);

    const organizationEscapeRooms = await escapeRoomRepo.find({
      where: { organizationId },
      relations: ['businessHours']
    });

    return organizationEscapeRooms.map(toEscapeRoomDTO);
  }
);

const listBookings = withAuth(({ userId }) =>
  withParams(['escapeRoomId'], ({ escapeRoomId }) => async (req, res) => {
    const escapeRoomRepo = getRepository(EscapeRoomEntity);
    const bookingRepo = getRepository(BookingEntity);

    const escapeRoom = await escapeRoomRepo.findOne(escapeRoomId);

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND);
    }

    if (!isOrganizationMember(escapeRoom.organizationId, userId)) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    }

    const bookings = await bookingRepo.find({
      where: { escapeRoomId, endDate: MoreThan(new Date()) }
    });

    return send(res, STATUS_SUCCESS.OK, bookings.map(toBookingDTO));
  })
);

export const escapeRoomHandlers = [
  get('/organization/:organizationId/escape-room', listEscapeRooms), // TODO mark as public? No auth required
  post('/organization/:organizationId/escape-room', createEscapeRoom),
  get('/escape-room/:escapeRoomId/booking', listBookings),
  get('/escape-room/:escapeRoomId', getEscapeRoom), // TODO mark as public?
  put('/escape-room/:escapeRoomId', updateEscapeRoom)
];