import { of } from 'rxjs';
import { AnyAction } from 'redux';
import { push } from 'react-router-redux';
import { ofType } from 'redux-observable';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';

import * as API from '../../constants/api.constants';
import { ajaxPostResponse } from '../../helpers/epic.helper';
import { TokenHelper } from '../../helpers/token.helper';
import * as authTypes from '../../constants/auth.types.constants';
import { getActiveLanguage } from 'react-localize-redux';

import { SignInAction } from '../../redux/actions/auth.actions';

export const signInEpic = (action$: AnyAction, state$: any) =>
  action$.pipe(
    ofType(authTypes.REQUEST_SIGNIN),
    switchMap((action: SignInAction) => {
      const currentLanguage = getActiveLanguage(state$.value.localize).code;
      return ajaxPostResponse(
        API.SIGN_IN_API,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((res: any) => {
          console.log(res);
          TokenHelper.SetToken(res.body.token);

          return of(
            {
              type: authTypes.SUCCESS_SIGNIN,
              payload: true,
            },
            push(`/${currentLanguage}/app`)
          );
        }),
        catchError((error) => {
          const serverMessage = error.response.message;
          return of({
            type: authTypes.FAILURE_SIGNIN,
            payload: {
              isError: true,
              errorMessage: serverMessage,
            },
          });
        })
      );
    })
  );
