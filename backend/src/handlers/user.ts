import { withBody } from '@app/decorators/withBody'
import { CreateUserDTO } from '@app/dto/CreateUserDTO'
import { UserEntity } from '@app/entities/UserEntity'
import * as bcrypt from 'bcryptjs'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

const createUser = withBody(CreateUserDTO, dto => async (req, res) => {
  const userRepo = getRepository(UserEntity)

  const password = await bcrypt.hash(dto.password, 10)
  const newUser = userRepo.create({ ...dto, password })

  await userRepo.save(newUser)

  return send(res, 200)
})

export default [post('/users', createUser)]
