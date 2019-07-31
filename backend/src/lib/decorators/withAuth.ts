import { verifyToken } from '@app/helpers/auth'
import { STATUS_ERROR } from '@app/lib/constants'
import { RequestHandler, send } from 'micro'

export function withAuth(handler: (payload: JwtPayload) => RequestHandler): RequestHandler {
  return async (req, res) => {
    const authHeader = (req.headers.Authorization || req.headers.authorization) as (
      | string
      | undefined)

    if (authHeader) {
      const payload = verifyToken(authHeader.split('Bearer ')[1]) as JwtPayload

      if (payload) {
        return new Date(payload.expires) > new Date()
          ? await handler(payload)(req, res)
          : await send(res, STATUS_ERROR.UNAUTHORIZED) // Token has expired
      }
    }

    return await send(res, STATUS_ERROR.UNAUTHORIZED) // Token is not present in headers
  }
}
