import { CreateEscapeRoomDTO } from '@app/dto/CreateEscapeRoomDTO'
import { toEscapeRoomDTO } from '@app/dto/EscapeRoomDTO'
import { UpdateEscapeRoomDTO } from '@app/dto/UpdateEscapeRoomDTO'
import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { isOrganizationMember } from '@app/helpers/organizationHelpers'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import { send } from 'micro'
import { get, post, put } from 'microrouter'
import { getRepository } from 'typeorm'

// TODO: check organization escape room limits, how many it has already
const createEscapeRoom = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(CreateEscapeRoomDTO, dto => async (req, res) => {
      const escapeRoomRepo = getRepository(EscapeRoomEntity)
      const organizationRepo = getRepository(OrganizationEntity)

      // TODO: util method to get with relation and check existance, return monad
      const organization = await organizationRepo.findOne(organizationId)

      if (!organization) {
        return send(res, STATUS_ERROR.NOT_FOUND)
      }

      // TODO: check permissions when implemented
      if (!isOrganizationMember(organizationId, userId)) {
        return send(res, STATUS_ERROR.FORBIDDEN)
      }

      // TODO: maybe make interval (duration) mandatory when creating schedule for escape room
      const schedule = {
        interval: dto.interval || 60,
        workHours: dto.workHours || organization.workHours,
        weekDays: dto.weekDays || organization.weekDays
      }

      const newEscapeRoom = escapeRoomRepo.create({ ...dto, ...schedule, organizationId })
      await escapeRoomRepo.save(newEscapeRoom)

      return send(res, STATUS_SUCCESS.OK, toEscapeRoomDTO(newEscapeRoom))
    })
  )
)

const updateEscapeRoom = withAuth(({ userId }) =>
  withParams(['escapeRoomId'], ({ escapeRoomId }) =>
    withBody(UpdateEscapeRoomDTO, dto => async (req, res) => {
      const escapeRoomRepo = getRepository(EscapeRoomEntity)
      const escapeRoom = await escapeRoomRepo.findOne(escapeRoomId)

      if (!escapeRoom) {
        return send(res, STATUS_ERROR.NOT_FOUND)
      }

      // TODO: check permissions when implemented
      if (!isOrganizationMember(escapeRoom.organizationId, userId)) {
        return send(res, STATUS_ERROR.FORBIDDEN)
      }

      escapeRoomRepo.merge(escapeRoom, dto)

      await escapeRoomRepo.save(escapeRoom)

      return send(res, STATUS_SUCCESS.OK)
    })
  )
)

// TODO: query param to get only the ones with working hours
// TODO: separate private endpoint to get bookings
// TODO: separate public endpoint to get availability
const listEscapeRooms = withParams(['organizationId'], ({ organizationId }) => async (req, res) => {
  const escapeRoomRepo = getRepository(EscapeRoomEntity)

  const organizationEscapeRooms = await escapeRoomRepo.find({ where: { organizationId } })

  return organizationEscapeRooms.map(toEscapeRoomDTO)
})

export default [
  get('/organization/:organizationId/escape-room', listEscapeRooms), // TODO mark as public? No auth required
  post('/organization/:organizationId/escape-room', createEscapeRoom),
  put('/escape-room/:escapeRoomId', updateEscapeRoom)
]
