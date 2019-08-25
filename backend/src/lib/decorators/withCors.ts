import { STATUS_SUCCESS } from '@app/lib/constants'
import { RequestHandler, send } from 'micro'

const ALLOW_METHODS = ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

const ALLOW_HEADERS = [
  'X-Requested-With',
  'Access-Control-Allow-Origin',
  'X-HTTP-Method-Override',
  'Content-Type',
  'Authorization',
  'Accept'
]

const MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours

export function withCors(handler: RequestHandler): RequestHandler {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', ALLOW_METHODS.join(','))
      res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS.join(','))
      res.setHeader('Access-Control-Max-Age', String(MAX_AGE_SECONDS))
      return send(res, STATUS_SUCCESS.OK)
    }

    return await handler(req, res)
  }
}
