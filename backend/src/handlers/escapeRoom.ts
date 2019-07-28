import { CreateEscapeRoomDTO } from '@app/dto/CreateEscapeRoomDTO'
import { UpdateEscapeRoomDTO } from '@app/dto/UpdateEscapeRoomDTO'
import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { isOrganizationMember } from '@app/helpers/organizationHelpers'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import { send } from 'micro'
import { post, put } from 'microrouter'
import { getRepository } from 'typeorm'

// TODO: check organization escape room limits, how many it has already
const createEscapeRoom = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(CreateEscapeRoomDTO, dto => async (req, res) => {
      const escapeRoomRepo = getRepository(EscapeRoomEntity)

      // TODO: check permissions when implemented
      if (!isOrganizationMember(organizationId, userId)) {
        return send(res, STATUS_ERROR.FORBIDDEN)
      }

      const newEscapeRoom = escapeRoomRepo.create({ ...dto, organizationId })
      await escapeRoomRepo.save(newEscapeRoom)

      return send(res, STATUS_SUCCESS.OK)
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

export default [
  post('/organization/:organizationId/escape-room', createEscapeRoom),
  put('/escape-room/:escapeRoomId', updateEscapeRoom)
]
