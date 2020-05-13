import { PaginationInfo, Pagination } from './../../interfaces/index';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractSuccessPendingActions,
  extractErrorPendingActions,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { from } from 'rxjs';
import * as dealerTypes from '../../constants/dealer.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxPostResponse,
  ajaxGetWebResponse,
} from '../../helpers/epic.helper';
import * as api from '../../constants/api.constants';

export const getDealersListEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.GET_DEALERS_LIST),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxGetWebResponse(api.GET_DEALERS_ALL, state$.value).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealersList(successResponse.entities),
            dealerActions.updateDealerListPagination(
              successResponse.paginationInfo
            ),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_DEALERS_LIST' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const getDealersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.GET_DEALERS_LIST_PAGINATED),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;
      debugger;
      return ajaxGetWebResponse(api.GET_DEALERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pagination.paginationInfo.pageNumber}` },
        { key: 'limit', value: `${pagination.limit}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealersList(successResponse.entities),
            dealerActions.updateDealerListPagination(
              successResponse.paginationInfo
            ),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_DEALERS_LIST' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const saveNewDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.SAVE_NEW_DEALER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPostResponse(
        api.CREATE_NEW_DEALER,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [...extractSuccessPendingActions(action)];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [...extractErrorPendingActions(action)];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const addStoresByDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.GET_STORES_BY_DEALER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxGetWebResponse(api.GET_STORES_BY_DEALER, state$.value).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealersList(successResponse.entities),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_STORES_BY_DEALERS_ID' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};
