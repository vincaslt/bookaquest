import * as bcrypt from 'bcryptjs';
import { send } from 'micro';
import { get, post } from 'microrouter';
import { withBody } from '../lib/decorators/withBody';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { withAuth } from '../lib/decorators/withAuth';
import { UserModel, UserInitFields } from '../models/User';

const createUser = withBody(CreateUserDTO, dto => async (req, res) => {
  const userExists = UserModel.exists({ email: dto.email });

  if (userExists) {
    return send(res, STATUS_ERROR.BAD_REQUEST);
  }

  const password = await bcrypt.hash(dto.password, 10);
  const user: UserInitFields = {
    ...dto,
    password
  };

  await UserModel.create(user);

  return send(res, STATUS_SUCCESS.OK);
});

const getAuthUserInfo = withAuth(({ userId }) => async (req, res) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    return send(res, STATUS_ERROR.NOT_FOUND);
  }

  return send(res, STATUS_SUCCESS.OK, user);
});

export const userHandlers = [
  post('/user', createUser),
  get('/user/me', getAuthUserInfo)
];
