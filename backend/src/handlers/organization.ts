import { withAuth } from '@app/decorators/withAuth'
import { withBody } from '@app/decorators/withBody'
import { CreateOrganizationDTO } from '@app/dto/CreateOrganizationDTO'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { send } from 'micro'
import { post } from 'microrouter'
import { getManager, getRepository } from 'typeorm'

// TODO: check user organization limits? Pay per organization
const createOrganization = withAuth(({ userId }) =>
  withBody(CreateOrganizationDTO, dto => async (req, res) => {
    const organizationRepo = getRepository(OrganizationEntity)
    const organizationMembershipRepo = getRepository(OrganizationMembershipEntity)

    getManager().transaction(async transactionalManager => {
      const newOrganization = organizationRepo.create({ ...dto })
      const organization = await transactionalManager.save(newOrganization)

      const newMember = organizationMembershipRepo.create({
        isOwner: true,
        organization,
        userId
      })
      await transactionalManager.save(newMember)
    })

    return send(res, 200)
  })
)

export default [post('/organization', createOrganization)]
