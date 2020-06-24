import { EntityBase, EntityBaseNamed } from './base';

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
}

export class UserRole extends EntityBase {}

export enum RoleType {
  Administrator = 0,
  Manufacturer = 1,
  Dealer = 2,
  Customer = 3,
}

export class UserIdentityRoleType extends EntityBaseNamed {
  constructor() {
    super();

    this.roleType = RoleType.Administrator;
  }

  roleType: RoleType;
}
