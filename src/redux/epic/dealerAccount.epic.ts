import { dealerAccountActions } from './../slices/dealerAccount.slice';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { controlActions } from '../slices/control.slice';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxGetWebResponse,
  ajaxDeleteResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import StoreHelper from '../../helpers/store.helper';
import { Pagination } from '../../interfaces';

const _parseDateToString = (date: Date | null | undefined) => {
  let result = '';

  if (date) {
    result = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  return result;
};

export const apiGetDealersPaginatedEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerAccountActions.apiGetDealersPaginated.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      const languageCode = getActiveLanguage(state$.value.localize).code;

      const paginationLimit: number =
        state$.value.dealerAccount.pagination.limit;
      const pageNumber: number =
        state$.value.dealerAccount.pagination.paginationInfo.pageNumber;
      const searchPhrase: string =
        state$.value.dealerAccount.filter.fromDsearchWordate;
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
            [
              dealerActions.updateDealersList(
                successResponse.entities ? successResponse.entities : null
              ),
              dealerActions.updateDealerListPaginationInfo(
                successResponse.paginationInfo
              ),
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

export const apiGetDealersPaginatedPageEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerAccountActions.apiGetDealersPaginatedPage.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      const paginationLimit = action.payload.paginationLimit;
      const pageNumber = action.payload.paginationPageNumber;
      const searchPhrase = action.payload.searchPhrase;
      const fromDate: Date | null | undefined = action.payload.fromDate;
      const toDate: Date | null | undefined = action.payload.toDate;

      return ajaxGetWebResponse(api.GET_DEALERS_ALL, state$.value, [
        { key: 'limit', value: `${paginationLimit}` },
        {
          key: 'pageNumber',
          value: `${pageNumber}`,
        },
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
              [
                { type: 'ERROR_GET_DEALERS_PAGINATED' },
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while get dealers paginated. ${errorResponse}`
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
