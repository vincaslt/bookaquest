import { toBookingDTO } from '@app/dto/BookingDTO'
import { CreateOrganizationDTO } from '@app/dto/CreateOrganizationDTO'
import { toMemberDTO } from '@app/dto/OrganizationMemberDTO'
import { UpdateOrganizationDTO } from '@app/dto/UpdateOrganizationDTO'
import { toUserMembershipDTO, toUserOrganizationDTO } from '@app/dto/UserInfoDTO'
import { BookingEntity } from '@app/entities/BookingEntity'
import { OrganizationEntity } from '@app/entities/OrganizationEntity'
import { OrganizationMembershipEntity } from '@app/entities/OrganizationMembershipEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { isOrganizationMember } from '@app/helpers/organizationHelpers'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import { send } from 'micro'
import { get, post, put } from 'microrouter'
import { getManager, getRepository, In, LessThan } from 'typeorm'

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

      // TODO: check privileges when implemented
      if (!isOrganizationMember(organizationId, userId)) {
        return send(res, STATUS_ERROR.FORBIDDEN)
      }

      const organization = await organizationRepo.findOne(organizationId)

      if (!organization) {
        return send(res, STATUS_ERROR.BAD_REQUEST)
      }

      const updatedOrganization = organizationRepo.merge(organization, dto)
      const savedOrganization = await organizationRepo.save(updatedOrganization)

      return send(res, STATUS_SUCCESS.OK, toUserOrganizationDTO(savedOrganization))
    })
  )
)

const listBookings = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) => async (req, res) => {
    const organizationRepo = getRepository(OrganizationEntity)
    const bookingRepo = getRepository(BookingEntity)

    if (!isOrganizationMember(organizationId, userId)) {
      return send(res, STATUS_ERROR.FORBIDDEN)
    }

    const organization = await organizationRepo.findOne(organizationId, {
      relations: ['escapeRooms']
    })

    if (!organization) {
      return send(res, STATUS_ERROR.NOT_FOUND)
    }

    const escapeRoomIds = organization.escapeRooms.map(({ id }) => id)
    const bookings = await bookingRepo.find({
      where: { escapeRoomId: In(escapeRoomIds), endDate: LessThan(new Date()) }
    })

    return send(res, STATUS_SUCCESS.OK, bookings.map(toBookingDTO))
  })
)

const listMembers = withAuth(({ userId }) =>
  withParams(['organizationId'], ({ organizationId }) => async (req, res) => {
    const organizationMembershipRepo = getRepository(OrganizationMembershipEntity)

    if (!isOrganizationMember(organizationId, userId)) {
      return send(res, STATUS_ERROR.FORBIDDEN)
    }

    const memberships = await organizationMembershipRepo.find({
      where: { organizationId },
      relations: ['user']
    })

    return send(res, STATUS_SUCCESS.OK, memberships.map(toMemberDTO))
  })
)

export default [
  post('/organization', createOrganization),
  put('/organization/:organizationId', updateOrganization),
  get('/organization/:organizationId/booking', listBookings),
  get('/organization/:organizationId/member', listMembers)
]
