import { createError } from 'micro';
import { ServerRequest } from 'microrouter';
import { JwtPayload } from '../interfaces';
import { STATUS_ERROR } from '../constants';
import { verifyToken } from '../../helpers/auth';

export function getAuth(req: ServerRequest) {
  const authHeader = (req.headers.Authorization ||
    req.headers.authorization) as string | undefined;

  if (!authHeader) {
    throw createError(STATUS_ERROR.UNAUTHORIZED, 'Missing access token');
  }

  const payload = verifyToken(authHeader.split('Bearer ')[1]) as JwtPayload;

  if (!payload) {
    throw createError(STATUS_ERROR.UNAUTHORIZED, 'Invalid access token');
  }

  if (new Date(payload.expires) < new Date()) {
    throw createError(STATUS_ERROR.UNAUTHORIZED, 'Access token has expired');
  }

  return payload;
}
