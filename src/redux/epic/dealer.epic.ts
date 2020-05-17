import { Pagination } from './../../interfaces/index';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractSuccessPendingActions,
  extractErrorPendingActions,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import { from } from 'rxjs';
import * as dealerTypes from '../../constants/dealer.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxPostResponse,
  ajaxGetWebResponse,
  ajaxPutResponse,
  ajaxDeleteResponse,
} from '../../helpers/epic.helper';
import * as api from '../../constants/api.constants';

export const getDealersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.GET_DEALERS_LIST_PAGINATED),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;

      return ajaxGetWebResponse(api.GET_DEALERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pagination.paginationInfo.pageNumber}` },
        { key: 'limit', value: `${pagination.limit}` },
        {
          key: 'searchPhrase',
          value: `${state$.value.dealer.dealerState.search}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealersList(successResponse.entities),
            dealerActions.updateDealerListPaginationInfo(
              successResponse.paginationInfo
            ),
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

export const deleteDealerByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.DELETE_DEALER_BY_ID),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return ajaxDeleteResponse(api.DELETE_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_DELETE_DEALER_BY_ID' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const getAndSelectDealersByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.GET_AND_SELECT_DEALER_BY_ID),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxGetWebResponse(api.GET_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.setSelectedDealer(successResponse),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_AND_SELECT_DEALER_BY_ID' },
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
          let successResultFlow = [
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];

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

export const updateDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.UPDATE_DEALER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPutResponse(
        api.UPDATE_DEALER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];
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

export const getStoresByDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.GET_STORES_BY_DEALER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxGetWebResponse(api.GET_STORES_BY_DEALER, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.setDealerStores(successResponse),

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

export const updateDealerStoreEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.UPDATE_DEALER_STORE),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPutResponse(
        api.UPDATE_DEALER_STORE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.setUpdateDealerStore(successResponse.body),
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];
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

export const addStoreToCurrentDealerEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.ADD_STORE_TO_CURRENT_DEALER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPostResponse(
        api.CREATE_DEALER_STORE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          debugger;
          let successResultFlow = [
            dealerActions.addNewStoreToCurrentDealer(successResponse.body),
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];

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

export const deleteCurrentDealerStoreEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.DELETE_CURRENT_DEALER_STORE),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxDeleteResponse(api.DELETE_CURRENT_DEALER_STORE, state$.value, [
        { key: 'storeId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealerStoresAfterDelete(successResponse.body),
            controlActions.showInfoMessage(successResponse.message),

            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_DELETE_CURRENT_DEALER_STORE' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};
