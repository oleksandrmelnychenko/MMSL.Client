import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError, debounceTime } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { controlActions } from '../slices/control.slice';
import { of } from 'rxjs';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxGetWebResponse,
  ajaxDeleteResponse,
  ajaxPostResponse,
  ajaxPutResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import StoreHelper from '../../helpers/store.helper';
import { dealerAccountActions } from '../slices/dealerAccount.slice';

const _parseDateToString = (date: Date | null | undefined) => {
  let result = '';

  if (date) {
    result = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  return result;
};

export const apiGetDealersPaginatedEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerAccountActions.apiGetDealersPaginatedFlow.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      const languageCode = getActiveLanguage(state$.value.localize).code;

      const paginationLimit: number =
        state$.value.dealerAccount.pagination.limit;
      const pageNumber: number =
        state$.value.dealerAccount.pagination.paginationInfo.pageNumber;
      const searchPhrase: string = state$.value.dealerAccount.filter.searchWord;
      const fromDate: Date | null | undefined =
        state$.value.dealerAccount.filter.fromDate;
      const toDate: Date | null | undefined =
        state$.value.dealerAccount.filter.toDate;

      return ajaxGetWebResponse(api.GET_DEALERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pageNumber}` },
        { key: 'limit', value: `${paginationLimit}` },
        {
          key: 'searchPhrase',
          value: `${searchPhrase}`,
        },
        {
          key: 'from',
          value: _parseDateToString(fromDate),
        },
        {
          key: 'to',
          value: _parseDateToString(toDate),
        },
      ]).pipe(
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
              [{ type: 'ERROR' }, controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const apiCreateDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerAccountActions.apiCreateDealer.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPostResponse(
        api.CREATE_NEW_DEALER,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.closeRightPanel(),
              controlActions.showInfoMessage(successResponse.message),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.closeRightPanel(),
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while creating new dealer account. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiUpdateDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerAccountActions.apiUpdateDealer.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPutResponse(
        api.UPDATE_DEALER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.closeRightPanel(),
              controlActions.showInfoMessage(successResponse.message),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.closeRightPanel(),
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while updating dealer account. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiDeleteDealerByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerAccountActions.apiDeleteDealerById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxDeleteResponse(api.DELETE_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(successResponse.message),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_DELETE_DEALER_BY_ID' },
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while deleting dealer. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const debounceFilterSearchWordEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerAccountActions.debounceFilterSearchWord.type),
    debounceTime(1500),
    switchMap((action: AnyAction) => {
      console.log('Debounce');
      return of(dealerAccountActions.changeFilterSearchWord(action.payload));
    })
  );
};
