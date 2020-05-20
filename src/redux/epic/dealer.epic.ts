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
import * as dealerTypes from '../constants/dealer.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxPostResponse,
  ajaxGetWebResponse,
  ajaxPutResponse,
  ajaxDeleteResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../reducers/dealer.reducer';
import StoreHelper from '../../helpers/store.helper';

export const getDealersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.GET_DEALERS_LIST_PAGINATED),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const fromDate = state$.value.dealer.dealerState.fromDate;
      const toDate = state$.value.dealer.dealerState.toDate;

      return ajaxGetWebResponse(api.GET_DEALERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pagination.paginationInfo.pageNumber}` },
        { key: 'limit', value: `${pagination.limit}` },
        {
          key: 'searchPhrase',
          value: `${state$.value.dealer.dealerState.search}`,
        },
        {
          key: 'from',
          value: `${
            fromDate
              ? `${fromDate.getFullYear()}-${
                  fromDate.getMonth() + 1
                }-${fromDate.getDate()}`
              : ''
          }`,
        },
        {
          key: 'to',
          value: `${
            toDate
              ? `${toDate.getFullYear()}-${
                  toDate.getMonth() + 1
                }-${toDate.getDate()}`
              : ''
          }`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealersList(successResponse.entities),
            dealerActions.updateDealerListPaginationInfo(
              successResponse.paginationInfo
            ),
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR' },
              controlActions.disabledStatusBar(),
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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxDeleteResponse(api.DELETE_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            controlActions.showInfoMessage(successResponse.message),
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_DELETE_DEALER_BY_ID' },
              controlActions.disabledStatusBar(),
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
      const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      openDetailsArgs.isOpen = true;
      openDetailsArgs.componentType = DealerDetilsComponents.DealerDetails;
      return ajaxGetWebResponse(api.GET_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.setSelectedDealer(successResponse),
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_AND_SELECT_DEALER_BY_ID' },
              controlActions.disabledStatusBar(),
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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPostResponse(
        api.CREATE_NEW_DEALER,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            controlActions.showInfoMessage(successResponse.message),
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPutResponse(
        api.UPDATE_DEALER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            controlActions.showInfoMessage(successResponse.message),
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];
          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_STORES_BY_DEALER, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.setDealerStores(successResponse),
            controlActions.disabledStatusBar(),

            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_STORES_BY_DEALERS_ID' },
              controlActions.disabledStatusBar(),
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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
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
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];
          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPostResponse(
        api.CREATE_DEALER_STORE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.addNewStoreToCurrentDealer(successResponse.body),
            controlActions.disabledStatusBar(),
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxDeleteResponse(api.DELETE_CURRENT_DEALER_STORE, state$.value, [
        { key: 'storeId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateDealerStoresAfterDelete(successResponse.body),
            controlActions.disabledStatusBar(),
            controlActions.showInfoMessage(successResponse.message),

            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_DELETE_CURRENT_DEALER_STORE' },
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const getStoreCustomersByStoreIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.GET_STORE_CUSTOMERS_BY_STORE_ID),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_CUSTOMERS_ALL, state$.value, [
        {
          key: 'storeId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateTargetStoreCustomersList(
              successResponse.entities
            ),
            controlActions.disabledStatusBar(),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR' },
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const deleteCurrentCustomerFromStoreEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerTypes.DELETE_CUSTOMER_FROM_STORE),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxDeleteResponse(api.DELETE_CUSTOMER_FROM_STORE, state$.value, [
        { key: 'storeCustomerId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateCustomersStoreAfterDeleteCustomer(
              successResponse.body
            ),
            controlActions.disabledStatusBar(),
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'DELETE_CUSTOMER_FROM_STORE' },
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const updateStoreCustomerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.UPDATE_STORE_CUSTOMER),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPutResponse(
        api.UPDATE_STORE_CUSTOMER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateCustomerListAfterUpdateCustomer(
              successResponse.body
            ),
            dealerActions.setSelectedCustomerInCurrentStore(
              successResponse.body
            ),
            controlActions.disabledStatusBar(),
            controlActions.showInfoMessage(successResponse.message),
            ...extractSuccessPendingActions(action),
          ];
          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_UPDATE_STORE_CUSTOMER' },
              controlActions.disabledStatusBar(),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};
