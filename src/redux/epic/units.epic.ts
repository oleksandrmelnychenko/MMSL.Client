import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractErrorPendingActions,
  extractSuccessPendingActions,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import * as unitsTypes from '../constants/units.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import { ajaxGetWebResponse } from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import * as unitsActions from '../actions/units.actions';

export const getCurrenciesEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(unitsTypes.GET_CURRENCIES),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxGetWebResponse(api.GET_CURRENCIES_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          /// TODO:
          let successResultFlow = [
            unitsActions.setCurrencies(successResponse),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const getPaymentTypesEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(unitsTypes.GET_PAYMENT_TYPES),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxGetWebResponse(api.GET_PAYMENT_TYPES_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          /// TODO:
          let successResultFlow = [
            unitsActions.setPaymentTypes(successResponse),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};
