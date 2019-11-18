import { randomFillSync } from 'crypto';
import { addDays, addMinutes } from 'date-fns';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from '../lib/interfaces';
import {
  RefreshTokenModel,
  RefreshTokenInitFields
} from '../models/RefreshToken';

function generateRandomString(length: number) {
  const validChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = randomFillSync(new Uint8Array(length));
  return String.fromCharCode(
    ...array.map(x => validChars.charCodeAt(x % validChars.length))
  );
}

export async function issueRefreshToken(userId: string) {
  const expirationDate = addDays(new Date(), 14);
  const token = generateRandomString(256);

  const refreshToken: RefreshTokenInitFields = {
    user: userId,
    expirationDate,
    token
  };

  return await RefreshTokenModel.create(refreshToken);
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

  return sign(payload, process.env.JWT_SECRET);
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
  return tokenExists && issueAccessToken(userId);
}
