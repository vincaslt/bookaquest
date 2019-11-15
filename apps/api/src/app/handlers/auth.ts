import * as bcrypt from 'bcryptjs';
import { send } from 'micro';
import { post } from 'microrouter';
import { getRepository } from 'typeorm';
import { withBody } from '../lib/decorators/withBody';
import { SignInDTO } from '../dto/SignInDTO';
import { UserEntity } from '../entities/UserEntity';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import {
  issueAccessToken,
  issueRefreshToken,
  refreshAccessToken
} from '../helpers/auth';
import { toUserInfoDTO } from '../dto/UserInfoDTO';
import { withAuth } from '../lib/decorators/withAuth';
import { RefreshTokenEntity } from '../entities/RefreshTokenEntity';
import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';

const login = withBody(SignInDTO, dto => async (req, res) => {
  const userRepo = getRepository(UserEntity);
  const user = await userRepo.findOne({
    where: { email: dto.email },
    relations: ['memberships', 'memberships.organization']
    // select: ['password'] // TODO: enable when fixed
  });

  if (!user) {
    return send(res, STATUS_ERROR.UNAUTHORIZED);
  }

  const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordCorrect) {
    return send(res, STATUS_ERROR.UNAUTHORIZED);
  }

  return send(res, STATUS_SUCCESS.OK, {
    tokens: {
      accessToken: await issueAccessToken(user.id),
      refreshToken: await issueRefreshToken(user.id)
    },
    user: toUserInfoDTO(user)
  });
});

const logout = withAuth(({ userId }) => async (req, res) => {
  const tokenRepo = getRepository(RefreshTokenEntity);
  await tokenRepo.delete({ userId });
  return send(res, STATUS_SUCCESS.OK);
});

const refreshToken = withBody(RefreshTokenDTO, dto => async (req, res) => {
  const token = await refreshAccessToken(dto.userId, dto.refreshToken);

  if (!token) {
    return send(res, STATUS_ERROR.UNAUTHORIZED);
  }

  return send(res, STATUS_SUCCESS.OK, { token });
});

export const authHandlers = [
  post('/login', login),
  post('/refreshToken', refreshToken),
  post('/logout', logout)
];
