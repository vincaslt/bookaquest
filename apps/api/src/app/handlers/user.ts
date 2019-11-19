import * as bcrypt from 'bcryptjs';
import { send } from 'micro';
import { get, post, AugmentedRequestHandler } from 'microrouter';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { STATUS_ERROR, STATUS_SUCCESS } from '../lib/constants';
import { UserModel, UserInitFields } from '../models/User';
import { OrganizationMembershipModel } from '../models/OrganizationMembership';
import { getBody } from '../lib/utils/getBody';
import { getAuth } from '../lib/utils/getAuth';
import { requireUserExists } from '../helpers/user';

const createUser: AugmentedRequestHandler = async (req, res) => {
  const dto = await getBody(req, CreateUserDTO);
  await requireUserExists({ email: dto.email });

  const password = await bcrypt.hash(dto.password, 10);
  const user: UserInitFields = {
    ...dto,
    password
  };

  await UserModel.create(user);

  return send(res, STATUS_SUCCESS.OK);
};

const getAuthUserInfo: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);

  const user = await UserModel.findById(userId);

  if (!user) {
    return send(res, STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  const memberships = await OrganizationMembershipModel.find({
    user: userId
  }).select('-user');

  return send(res, STATUS_SUCCESS.OK, { user, memberships });
};

export const userHandlers = [
  post('/user', createUser),
  get('/user/me', getAuthUserInfo)
];
