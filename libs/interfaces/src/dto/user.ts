export interface UserMembershipDTO {
  _id: string;
  isOwner: boolean;
  organization: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfoDTO {
  _id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  fullName: string;
  email: string;
  password: string;
}
