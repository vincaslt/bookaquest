import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { send } from 'micro';
import { get, post } from 'microrouter';
import { withBody } from '../lib/decorators/withBody';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserEntity } from '../entities/UserEntity';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { withAuth } from '../lib/decorators/withAuth';
import { toUserInfoDTO } from '../dto/UserInfoDTO';

const createUser = withBody(CreateUserDTO, dto => async (req, res) => {
  const userRepo = getRepository(UserEntity);
  const existingUser = await userRepo.findOne({ where: { email: dto.email } });

  if (existingUser) {
    return send(res, STATUS_ERROR.BAD_REQUEST);
  }

  const password = await bcrypt.hash(dto.password, 10);
  const newUser = userRepo.create({ ...dto, password });

  await userRepo.save(newUser);

  return send(res, STATUS_SUCCESS.OK);
});

const getAuthUserInfo = withAuth(({ userId }) => async (req, res) => {
  const userRepo = getRepository(UserEntity);
  const user = await userRepo.findOne(userId, {
    relations: ['memberships']
  });

  if (!user) {
    return send(res, STATUS_ERROR.UNAUTHORIZED);
  }

  return send(res, STATUS_SUCCESS.OK, toUserInfoDTO(user));
});

export const userHandlers = [
  post('/user', createUser),
  get('/user/me', getAuthUserInfo)
];
