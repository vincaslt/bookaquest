import { toBookingDTO } from '@app/dto/BookingDTO'
import { CreateOrganizationDTO } from '@app/dto/CreateOrganizationDTO'
import { toOrganizationDTO } from '@app/dto/OrganizationDTO'
import { toMemberDTO } from '@app/dto/OrganizationMemberDTO'
import { UpdateOrganizationDTO } from '@app/dto/UpdateOrganizationDTO'
import { toUserMembershipDTO } from '@app/dto/UserInfoDTO'
import { BookingEntity } from '@app/entities/BookingEntity'
import { OrganizationBusinessHoursEntity } from '@app/entities/OrganizationBusinessHoursEntity'
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
import { getManager, getRepository, In, MoreThan } from 'typeorm'

// TODO: check user organization limits? Pay per organization
const createOrganization = withAuth(({ userId }) =>
  withBody(CreateOrganizationDTO, dto => async (req, res) => {
    try {
      await getManager().transaction(async trans => {
        const organizationRepo = trans.getRepository(OrganizationEntity)
        const organizationMembershipRepo = trans.getRepository(OrganizationMembershipEntity)
        const businessHoursRepo = trans.getRepository(OrganizationBusinessHoursEntity)

        const newOrganization = organizationRepo.create({ ...dto, businessHours: [] })
        const organization = await organizationRepo.save(newOrganization)

        const businessHours = dto.businessHours
          ? businessHoursRepo.create(
              dto.businessHours.map(hours => ({ organizationId: organization.id, ...hours }))
            )
          : []
        await businessHoursRepo.save(businessHours)

        const newMember = organizationMembershipRepo.create({
          isOwner: true,
          organization,
          userId
        })
        await organizationMembershipRepo.save(newMember)
      })

      const userRepo = getRepository(UserEntity)
      const user = await userRepo.findOne(userId, {
        relations: ['memberships', 'memberships.organization']
      })

      return send(res, STATUS_SUCCESS.OK, user ? user.memberships.map(toUserMembershipDTO) : [])
    } catch (e) {
      return send(res, STATUS_ERROR.INTERNAL)
    }
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

      const organization = await organizationRepo.findOne(organizationId, {
        relations: ['businessHours']
      })

      if (!organization) {
        return send(res, STATUS_ERROR.BAD_REQUEST)
      }

      try {
        await getManager().transaction(async trans => {
          const transBusinessHoursRepo = trans.getRepository(OrganizationBusinessHoursEntity)
          const transOrganizationRepo = trans.getRepository(OrganizationEntity)

          await transBusinessHoursRepo.remove(organization.businessHours)

          const businessHours = dto.businessHours
            ? transBusinessHoursRepo.create(
                dto.businessHours.map(hours => ({ ...hours, organizationId: organization.id }))
              )
            : []

          const updatedOrganization = transOrganizationRepo.merge(organization, {
            ...dto,
            businessHours
          })

          await transOrganizationRepo.save(updatedOrganization)
          await transBusinessHoursRepo.save(businessHours)
        })

        const savedOrganization = await organizationRepo.findOne(organizationId, {
          relations: ['businessHours']
        })

        return send(
          res,
          STATUS_SUCCESS.OK,
          savedOrganization && toOrganizationDTO(savedOrganization)
        )
      } catch (e) {
        return send(res, STATUS_ERROR.INTERNAL)
      }
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

    const bookings = escapeRoomIds.length
      ? await bookingRepo.find({
          where: { escapeRoomId: In(escapeRoomIds), endDate: MoreThan(new Date()) }
        })
      : []

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

const getOrganization = withParams(['organizationId'], ({ organizationId }) => async (req, res) => {
  const organizationRepo = getRepository(OrganizationEntity)

  const organization = await organizationRepo.findOne(organizationId, {
    relations: ['businessHours']
  })

  if (!organization) {
    return send(res, STATUS_ERROR.NOT_FOUND)
  }

  return send(res, STATUS_SUCCESS.OK, toOrganizationDTO(organization))
})

export default [
  post('/organization', createOrganization),
  put('/organization/:organizationId', updateOrganization),
  get('/organization/:organizationId/booking', listBookings),
  get('/organization/:organizationId/member', listMembers),
  get('/organization/:organizationId', getOrganization) // TODO mark as public? no auth required
]
