import { CreateScheduleDTO } from '@app/dto/CreateScheduleDTO'
import { ScheduleEntity } from '@app/entities/ScheduleEntity'
import { STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

// FIXME: unused, irrelevant mostly
const createSchedule = withAuth(({ userId }) =>
  withBody(CreateScheduleDTO, dto => async (req, res) => {
    const scheduleRepo = getRepository(ScheduleEntity)

    const newSchedule = scheduleRepo.create({ ...dto, ownerId: userId })

    await scheduleRepo.save(newSchedule)

    return send(res, STATUS_SUCCESS.OK)
  })
)

export default [post('/schedule', createSchedule)]
