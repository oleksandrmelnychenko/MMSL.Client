import { EntityBase, EntityBaseNamed } from './base';

export enum RoleType {
  Administrator = 0,
  Manufacturer = 1,
  Dealer = 2,
  Customer = 3,
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
}

export class UserRole extends EntityBase {}

export class UserIdentityRoleType extends EntityBaseNamed {
  constructor() {
    super();

    this.roleType = RoleType.Administrator;
  }

  roleType: RoleType;
}

export class UserIdentity extends EntityBase {
  constructor() {
    super();

    this.email = '';
    this.passwordHash = '';
    this.passwordSalt = '';

    this.lastLoggedIn = null;

    this.isPasswordExpired = false;
    this.forceChangePassword = false;
    this.canUserResetExpiredPassword = false;

    this.passwordExpiresAt = new Date(Date.now());

    this.userRoles = [];
  }

  email: string;
  passwordHash: string;
  passwordSalt: string;

  lastLoggedIn: Date | null | undefined;

  isPasswordExpired: boolean;
  forceChangePassword: boolean;
  canUserResetExpiredPassword: boolean;

  passwordExpiresAt: Date;

  userRoles: UserRole[];
}
