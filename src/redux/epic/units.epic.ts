import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import { getWebRequest } from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import { unitsActions } from '../slices/units.slice';
import { controlActions } from '../slices/control.slice';
import StoreHelper from '../../helpers/store.helper';

export const getCurrenciesEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(unitsActions.getCurrencies.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_CURRENCIES_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              unitsActions.setCurrencies(successResponse),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [{ type: 'ERROR' }, controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const getPaymentTypesEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(unitsActions.getPaymentTypes.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return getWebRequest(api.GET_PAYMENT_TYPES_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              unitsActions.setPaymentTypes(successResponse),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [{ type: 'ERROR' }, controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};
