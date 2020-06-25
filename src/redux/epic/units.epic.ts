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
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import StoreHelper from '../../helpers/store.helper';

export const apiGetCurrenciesEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(unitsActions.apiGetCurrencies.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_CURRENCIES_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [controlActions.disabledStatusBar()],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_GET_CURRENCIES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while get currencies. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
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
    ofType(unitsActions.apiGetPaymentTypes.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return getWebRequest(api.GET_PAYMENT_TYPES_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [controlActions.disabledStatusBar()],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_GET_PAYMENT_TYPES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while get payment types. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
              action
            );
          });
        })
      );
    })
  );
};
