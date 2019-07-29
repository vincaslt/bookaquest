import { CreateUserDTO } from '@app/dto/CreateUserDTO'
import { UserEntity } from '@app/entities/UserEntity'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withBody } from '@app/lib/decorators/withBody'
import * as bcrypt from 'bcryptjs'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

const createUser = withBody(CreateUserDTO, dto => async (req, res) => {
  const userRepo = getRepository(UserEntity)
  const existingUser = userRepo.findOne({ where: { email: dto.email } })

  if (existingUser) {
    return send(res, STATUS_ERROR.BAD_REQUEST)
  }

  const password = await bcrypt.hash(dto.password, 10)
  const newUser = userRepo.create({ ...dto, password })

  await userRepo.save(newUser)

  return send(res, STATUS_SUCCESS.OK)
})

export default [post('/user', createUser)]
