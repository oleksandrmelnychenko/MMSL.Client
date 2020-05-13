import { TokenHelper } from './token.helper';
import { of } from 'rxjs';
import * as authTypes from '../constants/auth.types.constants';

export const checkUnauthorized = (
  status: number,
  currentLanguage: string,
  callBack: Function
) => {
  let result = null;

  if (status === 401) {
    TokenHelper.removeAccessToken();
    result = of({
      type: authTypes.LOGOUT,
    });
  } else {
    result = callBack();
  }

  return result;
};
