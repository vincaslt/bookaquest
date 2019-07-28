import { RefreshTokenDTO } from '@app/dto/RefreshTokenDTO'
import { SignInDTO } from '@app/dto/SignInDTO'
import { UserEntity } from '@app/entities/UserEntity'
import { withBody } from '@app/lib/decorators/withBody'
import { issueAccessToken, issueRefreshToken, refreshAccessToken } from '@app/utils/auth'
import * as bcrypt from 'bcryptjs'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

const login = withBody(SignInDTO, dto => async (req, res) => {
  const userRepo = getRepository(UserEntity)

  const user = await userRepo.findOne({ where: { email: dto.email } })

  if (!user) {
    return send(res, 401)
  }

  const isPasswordCorrect = await bcrypt.compare(dto.password, user.password)

  if (!isPasswordCorrect) {
    return send(res, 401)
  }

  return send(res, 200, {
    accessToken: await issueAccessToken(user.id),
    refreshToken: await issueRefreshToken(user.id)
  })
})

const refreshToken = withBody(RefreshTokenDTO, dto => async (req, res) => {
  const token = await refreshAccessToken(dto.userId, dto.refreshToken)

  if (!token) {
    return send(res, 401)
  }

  return send(res, 200, { token })
})

export default [post('/login', login), post('/refreshToken', refreshToken)]
