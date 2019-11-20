import { ClassType } from 'class-transformer/ClassTransformer';
import { transformAndValidate } from 'class-transformer-validator';
import { json, createError } from 'micro';
import { ServerRequest } from 'microrouter';
import { STATUS_ERROR } from '../constants';

export async function getBody<DTO extends object>(
  req: ServerRequest,
  dto: ClassType<DTO>
) {
  try {
    return await transformAndValidate<DTO>(dto, await json(req), {
      validator: {
        validationError: { target: false, value: false },
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
      }
    });
  } catch (e) {
    throw createError(STATUS_ERROR.BAD_REQUEST, e);
  }
}
