import { addDays, addMinutes } from 'date-fns';
import { sign, verify } from 'jsonwebtoken';
import { createError } from 'micro';
import { JwtPayload } from '../lib/interfaces';
import {
  RefreshTokenModel,
  RefreshTokenInitFields
} from '../models/RefreshToken';
import { STATUS_ERROR } from '../lib/constants';
import { generateRandomString } from '../utils/string';

export async function issueRefreshToken(userId: string) {
  const expirationDate = addDays(new Date(), 14);

  const refreshToken: RefreshTokenInitFields = {
    user: userId,
    expirationDate,
    token: generateRandomString(256)
  };

  const { token } = await RefreshTokenModel.create(refreshToken);

  return token;
}

export async function issueAccessToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('No jwt secret, please check env variables');
  }

  const expires = addMinutes(new Date(), 5);

  const payload: JwtPayload = {
    userId,
    expires
  };

  try {
    return sign(payload, process.env.JWT_SECRET);
  } catch (e) {
    throw createError(STATUS_ERROR.INTERNAL, 'Cannot sign access token');
  }
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('No jwt secret, please check env variables');
  }
  return verify(token, process.env.JWT_SECRET);
}

export async function refreshAccessToken(userId: string, refreshToken: string) {
  const tokenExists = await RefreshTokenModel.exists({
    user: userId,
    token: refreshToken,
    expirationDate: { $gt: new Date() }
  });

  if (!tokenExists) {
    throw createError(STATUS_ERROR.UNAUTHORIZED, 'Refresh token not found');
  }

  return issueAccessToken(userId);
}
