import { ServerRequest } from 'microrouter';
import { createError } from 'micro';
import { STATUS_ERROR } from '../constants';

export function getQuery<K extends string>(
  req: ServerRequest,
  keys?: K[]
): { [key in K]: string } | { [key: string]: string } {
  if (!keys) {
    return req.query;
  }

  const missingKey = keys.find(key => req.query[key] === undefined);

  if (missingKey) {
    throw createError(
      STATUS_ERROR.BAD_REQUEST,
      `Missing parameter ${missingKey}`
    );
  }

  return Object.entries(req.query).reduce((query, [key, value]) => {
    if (!keys.includes(key as K)) {
      throw createError(
        STATUS_ERROR.BAD_REQUEST,
        `Unexpected parameter ${key}`
      );
    }
    return { ...query, [key]: value };
  }, {} as { [key in K]: string });
}
