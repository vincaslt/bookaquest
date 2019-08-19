import { CreateOrganizationDTO } from '@app/dto/CreateOrganizationDTO'
import { UpdateOrganizationDTO } from '@app/dto/UpdateOrganizationDTO'
import { toUserMembershipDTO, toUserOrganizationDTO } from '@app/dto/UserInfoDTO'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { isOrganizationMember } from '@app/helpers/organizationHelpers'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import { send } from 'micro'
import { post, put } from 'microrouter'
import { getManager, getRepository } from 'typeorm'

// TODO: check user organization limits? Pay per organization
const createOrganization = withAuth(({ userId }) =>
  withBody(CreateOrganizationDTO, dto => async (req, res) => {
    const userRepo = getRepository(UserEntity)
    const organizationRepo = getRepository(OrganizationEntity)
    const organizationMembershipRepo = getRepository(OrganizationMembershipEntity)

    await getManager().transaction(async transactionalManager => {
      const newOrganization = organizationRepo.create({ ...dto })
      const organization = await transactionalManager.save(newOrganization)

      const newMember = organizationMembershipRepo.create({
        isOwner: true,
        organization,
        userId
      })
      await transactionalManager.save(newMember)
    })

    const user = await userRepo.findOne(userId, {
      relations: ['memberships', 'memberships.organization']
    })

    return send(res, STATUS_SUCCESS.OK, user ? user.memberships.map(toUserMembershipDTO) : [])
  })
)

const updateOrganization = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) =>
    withBody(UpdateOrganizationDTO, dto => async (req, res) => {
      const organizationRepo = getRepository(OrganizationEntity)

      const organization = await organizationRepo.findOne(organizationId)

      if (!organization) {
        return send(res, STATUS_ERROR.BAD_REQUEST)
      }

      // TODO: check privileges when implemented
      if (!isOrganizationMember(organizationId, userId)) {
        return send(res, STATUS_ERROR.FORBIDDEN)
      }

      const updatedOrganization = organizationRepo.merge(organization, dto)
      const savedOrganization = await organizationRepo.save(updatedOrganization)

      return send(res, STATUS_SUCCESS.OK, toUserOrganizationDTO(savedOrganization))
    })
  )
)

export default [
  post('/organization', createOrganization),
  put('/organization/:organizationId', updateOrganization)
]
