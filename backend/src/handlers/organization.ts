import { CreateOrganizationDTO } from '@app/dto/CreateOrganizationDTO'
import { toUserMembershipDTO } from '@app/dto/UserInfoDTO'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import { send } from 'micro'
import { post } from 'microrouter'
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

export default [post('/organization', createOrganization)]
