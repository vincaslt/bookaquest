import {
  CreateUserDTO,
  UserMembershipDTO,
  UserInfoDTO
} from '@bookaquest/interfaces';

export type CreateUser = CreateUserDTO;

export type UserMembership = Omit<
  UserMembershipDTO,
  'createdAt' | 'updatedAt'
> & {
  createdAt: Date;
  updatedAt: Date;
};

export type UserInfo = Omit<UserInfoDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

export function fromUserMembershipDTO(dto: UserMembershipDTO): UserMembership {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  };
}

export function fromUserInfoDTO(dto: UserInfoDTO): UserInfo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  };
}
