export interface UserMembershipDTO {
  isOwner: boolean;
  createdAt: string;
  organizationId: string;
}

export interface BasicUserInfoDTO {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface UserInfoDTO extends BasicUserInfoDTO {
  memberships: UserMembershipDTO[];
}

export interface CreateUserDTO {
  fullName: string;
  email: string;
  password: string;
}
