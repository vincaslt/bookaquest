import {
  CreateUserDTO,
  BasicUserInfoDTO,
  UserMembershipDTO,
  UserInfoDTO
} from '@bookaquest/interfaces';

export type CreateUser = CreateUserDTO;

export type BasicUserInfo = Omit<BasicUserInfoDTO, 'createdAt'> & {
  createdAt: Date;
};

export type UserMembership = Omit<UserMembershipDTO, 'createdAt'> & {
  createdAt: Date;
};

export type UserInfo = Omit<UserInfoDTO, 'createdAt' | 'memberships'> & {
  createdAt: Date;
  memberships: UserMembership[];
};

export function fromUserMembershipDTO(dto: UserMembershipDTO): UserMembership {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt)
  };
}

export function fromBasicUserInfoDTO(dto: BasicUserInfoDTO): BasicUserInfo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt)
  };
}

export function fromUserInfoDTO(dto: UserInfoDTO): UserInfo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    memberships: dto.memberships.map(fromUserMembershipDTO)
  };
}
