import { Ref } from '@typegoose/typegoose';
import { createError } from 'micro';
import { STATUS_ERROR } from '../lib/constants';
import { EscapeRoomModel, EscapeRoom } from '../models/EscapeRoom';

export async function requireEscapeRoom(
  escapeRoomId: string | Ref<EscapeRoom>
) {
  const escapeRoom = await EscapeRoomModel.findById(escapeRoomId);
  if (!escapeRoom) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Escape room not found');
  }
  return escapeRoom;
}
