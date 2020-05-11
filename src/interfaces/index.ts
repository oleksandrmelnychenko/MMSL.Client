export interface IUserInfo {
  userIdentityId: number;
  companyInfoId: number;
  userAccountType: number;
  userIdentity?: any;
  id: string;
  isDeleted?: boolean;
  created?: Date;
  lastModified?: Date;
}

export interface IAuthentication {
  email: string;
  password: string;
}

export interface IFailureAuth {
  isError: boolean;
  errorMessage: string;
}

export interface IAuthState {
  isAuth: boolean;
  errorMessage: string;
  isError: boolean;
  userInfo: IUserInfo;
}
