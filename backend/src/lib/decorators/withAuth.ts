import { verifyToken } from '@app/utils/auth'
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
          : await send(res, 401) // Token has expired
      }
    }

    return await send(res, 401) // Token is not present in headers
  }
}
