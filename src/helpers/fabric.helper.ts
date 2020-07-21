import { List } from 'linq-typescript';
import { TokenHelper } from './token.helper';
import { RoleType } from '../interfaces/identity';

export const isUserCanManageFabrics = (): boolean => {
  const rolesList = new List(TokenHelper.extractRolesFromJWT());

  return rolesList.contains(
    RoleType[RoleType.Administrator] || RoleType[RoleType.Manufacturer]
  );
};
