import { ClassType, transformAndValidate } from 'class-transformer-validator'
import { createError, json, RequestHandler } from 'micro'

export function withBody<DTO extends object>(
  dto: ClassType<DTO>,
  handler: (body: DTO) => RequestHandler
): RequestHandler {
  return async (req, res) => {
    try {
      return await handler(await transformAndValidate<DTO>(dto, await json(req)))(req, res)
    } catch (e) {
      throw createError(400, e.toString(), e)
    }
  }
}
