import { CreateEscapeRoomDTO } from '@app/dto/CreateEscapeRoomDTO'
import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

// TODO: check organization escape room limits, how many it has already
const createEscapeRoom = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(CreateEscapeRoomDTO, dto => async (req, res) => {
      const escapeRoomRepo = getRepository(EscapeRoomEntity)
      const organizationMembershipRepo = getRepository(OrganizationMembershipEntity)

      const membership = await organizationMembershipRepo.findOne({
        where: { userId, organizationId }
      })

      // TODO: check permissions when implemented
      if (!membership) {
        return send(res, STATUS_ERROR.FORBIDDEN)
      }

      const newEscapeRoom = escapeRoomRepo.create({ ...dto, organizationId })
      await escapeRoomRepo.save(newEscapeRoom)

      return send(res, STATUS_SUCCESS.OK)
    })
  )
)

export default [post('/organization/:organizationId/escape-room', createEscapeRoom)]
