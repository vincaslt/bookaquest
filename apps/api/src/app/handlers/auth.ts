import * as bcrypt from 'bcryptjs';
import { createError } from 'micro';
import { post, get, AugmentedRequestHandler } from 'microrouter';
import { omit } from 'ramda';
import { SignInDTO } from '../dto/SignInDTO';
import { STATUS_ERROR } from '../lib/constants';
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
import {
  findUserInvitations,
  findUserMemberships
} from '../helpers/organization';
import { getQuery } from '../lib/utils/getQuery';

const login: AugmentedRequestHandler = async (req, res) => {
  const { email, password } = await getBody(req, SignInDTO);

  const user = await UserModel.findOne({ email }).select('+password');

  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));

  if (!user || !isPasswordCorrect) {
    throw createError(STATUS_ERROR.UNAUTHORIZED, 'Invalid credentials');
  }

  const refreshToken = await issueRefreshToken(user.id);
  const accessToken = await issueAccessToken(user.id);

  await RefreshTokenModel.deleteMany({
    user: user.id,
    expirationDate: { $lte: new Date() }
  });

  const [memberships, invitations] = await Promise.all([
    findUserMemberships(user.id),
    findUserInvitations(user.id)
  ]);

  return {
    tokens: {
      accessToken,
      refreshToken
    },
    user: omit(['password'], user.toJSON()),
    memberships,
    invitations
  };
};

const logout: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const exists = await UserModel.exists({ _id: userId });

  if (!exists) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  await RefreshTokenModel.deleteMany({
    user: userId
  });
};

const refreshToken: AugmentedRequestHandler = async (req, res) => {
  const dto = await getBody(req, RefreshTokenDTO);
  const token = await refreshAccessToken(dto.userId, dto.refreshToken);
  return { token };
};

const verifyEmail: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);
  const { code } = getQuery(req, ['code']);

  const user = await UserModel.findById(userId).select('+verificationCode');

  if (!user) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  if (user.verificationCode !== code) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      'Invalid email verification code'
    );
  }

  if (user.verified) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'Email already verified');
  }

  user.verified = true;
  await user.save();
};

export const authHandlers = [
  post('/login', login),
  post('/refreshToken', refreshToken),
  post('/logout', logout),
  get('/verify', verifyEmail)
];
