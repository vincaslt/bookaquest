import { STATUS_ERROR } from '@app/lib/constants'
import { ClassType, transformAndValidate } from 'class-transformer-validator'
import { json, RequestHandler, send } from 'micro'

export function withBody<DTO extends object>(
  dto: ClassType<DTO>,
  handler: (body: DTO) => RequestHandler
): RequestHandler {
  return async (req, res) => {
    try {
      return await handler(
        await transformAndValidate<DTO>(dto, await json(req), {
          validator: { validationError: { target: false } }
        })
      )(req, res)
    } catch (e) {
      return send(res, STATUS_ERROR.BAD_REQUEST, e)
    }
  }
}
