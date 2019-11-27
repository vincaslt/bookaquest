import * as bcrypt from 'bcryptjs';
import { createError } from 'micro';
import { get, post, AugmentedRequestHandler } from 'microrouter';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { STATUS_ERROR } from '../lib/constants';
import { UserModel, UserInitFields } from '../models/User';
import { OrganizationMembershipModel } from '../models/OrganizationMembership';
import { getBody } from '../lib/utils/getBody';
import { getAuth } from '../lib/utils/getAuth';
import { OrganizationInvitationModel } from '../models/OrganizationInvitation';

const createUser: AugmentedRequestHandler = async (req, res) => {
  const dto = await getBody(req, CreateUserDTO);
  const exists = await UserModel.exists({ email: dto.email });

  if (exists) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'User already exists');
  }

  const password = await bcrypt.hash(dto.password, 10);
  const user: UserInitFields = {
    ...dto,
    password
  };

  await UserModel.create(user);
};

const getAuthUserInfo: AugmentedRequestHandler = async (req, res) => {
  const { userId } = getAuth(req);

  const user = await UserModel.findById(userId);

  if (!user) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  const memberships = await OrganizationMembershipModel.find({
    user: userId
  }).select('-user');

  const invitations = await OrganizationInvitationModel.find({ user: userId });

  return { user, memberships, invitations };
};

export const userHandlers = [
  post('/user', createUser),
  get('/user/me', getAuthUserInfo)
];
