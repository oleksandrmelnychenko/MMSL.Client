import { TokenHelper } from './token.helper';
import { of } from 'rxjs';
import { authActions } from '../redux/slices/auth.slice';

export const checkUnauthorized = (
  status: number,
  currentLanguage: string,
  callBack: Function
) => {
  let result = null;

  if (status === 401) {
    TokenHelper.removeAccessToken();
    result = of(authActions.logOut());
  } else {
    result = callBack();
  }

  return result;
};
