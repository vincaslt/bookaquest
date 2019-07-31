import { RefreshTokenDTO } from '@app/dto/RefreshTokenDTO'
import { SignInDTO } from '@app/dto/SignInDTO'
import { toUserInfoDTO } from '@app/dto/UserInfoDTO'
import { RefreshTokenEntity } from '@app/entities/RefreshTokenEntity'
import { UserEntity } from '@app/entities/UserEntity'
import { issueAccessToken, issueRefreshToken, refreshAccessToken } from '@app/helpers/auth'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import * as bcrypt from 'bcryptjs'
import { send } from 'micro'
import { post } from 'microrouter'
import { getRepository } from 'typeorm'

const login = withBody(SignInDTO, dto => async (req, res) => {
  const userRepo = getRepository(UserEntity)
  const user = await userRepo.findOne({
    where: { email: dto.email },
    relations: ['memberships', 'memberships.organization']
  })

  if (!user) {
    return send(res, STATUS_ERROR.UNAUTHORIZED)
  }

  const isPasswordCorrect = await bcrypt.compare(dto.password, user.password)

  if (!isPasswordCorrect) {
    return send(res, STATUS_ERROR.UNAUTHORIZED)
  }

  return send(res, STATUS_SUCCESS.OK, {
    tokens: {
      accessToken: await issueAccessToken(user.id),
      refreshToken: await issueRefreshToken(user.id)
    },
    user: toUserInfoDTO(user)
  })
})

const logout = withAuth(({ userId }) => async (req, res) => {
  const tokenRepo = getRepository(RefreshTokenEntity)
  await tokenRepo.delete({ userId })
  return send(res, STATUS_SUCCESS.OK)
})

const refreshToken = withBody(RefreshTokenDTO, dto => async (req, res) => {
  const token = await refreshAccessToken(dto.userId, dto.refreshToken)

  if (!token) {
    return send(res, STATUS_ERROR.UNAUTHORIZED)
  }

  return send(res, STATUS_SUCCESS.OK, { token })
})

export default [post('/login', login), post('/refreshToken', refreshToken), post('/logout', logout)]
