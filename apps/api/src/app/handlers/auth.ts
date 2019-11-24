import * as bcrypt from 'bcryptjs';
import { send } from 'micro';
import { post, AugmentedRequestHandler } from 'microrouter';
import { omit } from 'ramda';
import { SignInDTO } from '../dto/SignInDTO';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import {
  issueAccessToken,
  issueRefreshToken,
  refreshAccessToken
} from '../helpers/auth';
import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';
import { UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import { getBody } from '../lib/utils/getBody';
import { getAuth } from '../lib/utils/getAuth';
import { OrganizationMembershipModel } from '../models/OrganizationMembership';

const login: AugmentedRequestHandler = async (req, res) => {
  const { email, password } = await getBody(req, SignInDTO);

  const user = await UserModel.findOne({ email }).select('+password');

  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));

  if (!user || !isPasswordCorrect) {
    return send(res, STATUS_ERROR.UNAUTHORIZED, 'Invalid credentials');
  }

  const refreshToken = await issueRefreshToken(user.id);
  const accessToken = await issueAccessToken(user.id);

  await RefreshTokenModel.deleteMany({
    user: user.id,
    expirationDate: { $lte: new Date() }
  });

  const memberships = await OrganizationMembershipModel.find({
    user: user.id
  }).select('-user');

  return send(res, STATUS_SUCCESS.OK, {
    tokens: {
      accessToken,
      refreshToken
    },
    user: omit(['password'], user.toJSON()),
    memberships
  });
};

const logout: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const exists = await UserModel.exists({ user: userId });

  if (!exists) {
    return send(res, STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  await RefreshTokenModel.deleteMany({
    user: userId
  });

  return send(res, STATUS_SUCCESS.OK);
};

const refreshToken: AugmentedRequestHandler = async (req, res) => {
  const dto = await getBody(req, RefreshTokenDTO);
  const token = await refreshAccessToken(dto.userId, dto.refreshToken);
  return send(res, STATUS_SUCCESS.OK, { token });
};

export const authHandlers = [
  post('/login', login),
  post('/refreshToken', refreshToken),
  post('/logout', logout)
];
