import { of } from 'rxjs';
import { AnyAction } from 'redux';
import { push } from 'react-router-redux';
import { ofType } from 'redux-observable';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import * as API from '../constants/api.constants';
import { postWebRequest } from '../../helpers/epic.helper';
import { TokenHelper } from '../../helpers/token.helper';
import { authActions } from '../slices/auth.slice';
import { getActiveLanguage } from 'react-localize-redux';

export const signInEpic = (action$: AnyAction, state$: any) =>
  action$.pipe(
    ofType(authActions.signInAction.type),
    switchMap((action: AnyAction) => {
      const currentLanguage = getActiveLanguage(state$.value.localize).code;
      return postWebRequest(API.SIGN_IN_API, action.payload, state$.value).pipe(
        mergeMap((res: any) => {
          TokenHelper.SetToken(res.body.token);

          return of(
            authActions.authSuccessSignInAction(true),
            push(`/${currentLanguage}/app`)
          );
        }),
        catchError((error) => {
          const serverMessage = error.response.message;
          return of(
            authActions.failureSignInAction({
              isError: true,
              errorMessage: serverMessage,
            })
          );
        })
      );
    })
  );

export const logOutEpic = (action$: AnyAction, state$: any) =>
  action$.pipe(
    ofType(authActions.logOut.type),
    switchMap((action: AnyAction) => {
      const currentLanguage = getActiveLanguage(state$.value.localize).code;
      return of(push(`/${currentLanguage}/account-security/sign-in`));
    })
  );
