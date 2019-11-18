import { RequestHandler, send } from 'micro';
import { AugmentedRequestHandler } from 'microrouter';
import { JwtPayload } from '../interfaces';
import { STATUS_ERROR } from '../constants';
import { verifyToken } from '../../helpers/auth';

export function withAuth(
  handler: (payload: JwtPayload) => AugmentedRequestHandler
): RequestHandler {
  return async (req, res) => {
    const authHeader = (req.headers.Authorization ||
      req.headers.authorization) as string | undefined;

    if (authHeader) {
      const payload = verifyToken(authHeader.split('Bearer ')[1]) as JwtPayload;

      if (payload) {
        return new Date(payload.expires) > new Date()
          ? await handler(payload)(req as any, res)
          : await send(res, STATUS_ERROR.UNAUTHORIZED); // Token has expired
      }
    }

    return await send(res, STATUS_ERROR.UNAUTHORIZED); // Token is not present in headers
  };
}
