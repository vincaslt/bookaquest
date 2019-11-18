import * as bcrypt from 'bcryptjs';
import { send } from 'micro';
import { post } from 'microrouter';
import { omit } from 'ramda';
import { withBody } from '../lib/decorators/withBody';
import { SignInDTO } from '../dto/SignInDTO';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import {
  issueAccessToken,
  issueRefreshToken,
  refreshAccessToken
} from '../helpers/auth';
import { withAuth } from '../lib/decorators/withAuth';
import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';
import { UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';

const login = withBody(SignInDTO, dto => async (req, res) => {
  const user = await UserModel.findOne({ email: dto.email })
    .select('+password')
    .populate('memberships');

  const passwordCorrect =
    user && (await bcrypt.compare(dto.password, user.password));

  if (!user || !passwordCorrect) {
    return send(res, STATUS_ERROR.UNAUTHORIZED);
  }

  try {
    const refreshToken = await issueRefreshToken(user.id);
    const accessToken = await issueAccessToken(user.id);

    await RefreshTokenModel.deleteMany({
      user: user.id,
      expirationDate: { $lte: new Date() }
    });

    return send(res, STATUS_SUCCESS.OK, {
      tokens: {
        accessToken,
        refreshToken
      },
      user: omit(['password'])(user)
    });
  } catch (e) {
    return send(res, STATUS_ERROR.INTERNAL);
  }
});

const logout = withAuth(({ userId }) => async (req, res) => {
  if (await UserModel.exists(userId)) {
    return send(res, STATUS_ERROR.BAD_REQUEST);
  }

  await RefreshTokenModel.deleteMany({
    user: userId
  });

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
