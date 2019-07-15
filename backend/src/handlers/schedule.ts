import { withBody } from '@app/decorators/withBody'
import { CreateScheduleDTO } from '@app/dto/CreateScheduleDTO'
import { ScheduleEntity } from '@app/entities/ScheduleEntity'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

// TODO: protected endpoint
const createSchedule = withBody(CreateScheduleDTO, dto => async (req, res) => {
  const scheduleRepo = getRepository(ScheduleEntity)

  const newSchedule = scheduleRepo.create(dto)

  await scheduleRepo.save(newSchedule)

  return send(res, 200)
})

export default [post('/schedule', createSchedule)]
