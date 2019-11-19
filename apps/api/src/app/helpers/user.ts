import { createError } from 'micro';
import { UserModel } from '../models/User';
import { STATUS_ERROR } from '../lib/constants';

export async function requireUserExists(filter: any) {
  const exists = await UserModel.exists(filter);
  if (!exists) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'User not found');
  }
}
