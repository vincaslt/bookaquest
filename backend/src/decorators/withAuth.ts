import { verifyToken } from '@app/utils/auth'
import { RequestHandler, send } from 'micro'

export function withAuth(handler: (payload: JwtPayload) => RequestHandler): RequestHandler {
  return async (req, res) => {
    const authHeader = (req.headers.Authorization || req.headers.authorization) as (
      | string
      | undefined)

    if (authHeader) {
      const payload = verifyToken(authHeader.split('Bearer ')[1])

      if (payload) {
        return await handler(payload as JwtPayload)(req, res)
      }
    }

    return await send(res, 401)
  }
}
