import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { debounceTime, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { customerActions } from '../slices/customer/customer.slice';
import { getActiveLanguage } from 'react-localize-redux';
import {
  getWebRequest,
  postWebRequest,
  putWebRequest,
  deleteWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import { Pagination } from '../../interfaces';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { dealerActions } from '../../redux/slices/dealer.slice';
import StoreHelper from '../../helpers/store.helper';

export const getCustomersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(customerActions.getCustomersListPaginated.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_CUSTOMERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pagination.paginationInfo.pageNumber}` },
        { key: 'limit', value: `${pagination.limit}` },
        {
          key: 'searchPhrase',
          value: `${state$.value.customer.customerState.search}`,
        },
        {
          key: 'storeName',
          value: `${state$.value.customer.customerState.searchByStore}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              customerActions.updateCustomersList(successResponse.entities),
              customerActions.updateCustomersListPaginationInfo(
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
              [
                { type: 'ERROR_GET_CUSTOMERS_LIST' },
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

export const apigetAllCustomersEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(customerActions.apigetAllCustomers.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_CUSTOMERS_ALL, state$.value, []).pipe(
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
                { type: 'ERROR_GET_ALL_CUSTOMERS_LIST' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting all store customers. ${errorResponse}`,
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

export const apiGetCustomerByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(customerActions.apiGetCustomerById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_CUSTOMER_BY_ID, state$.value, [
        {
          key: 'storeCustomerId',
          value: `${action.payload}`,
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
                { type: 'ERROR_GET_CUSTOMER_BY_ID' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting customer. ${errorResponse}`,
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

export const customerFormStoreAutocompleteTextEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(customerActions.customerFormStoreAutocompleteText.type),
    debounceTime(300),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_ALL_STORES, state$.value, [
        {
          key: 'searchPhrase',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              customerActions.updateCustomerFormStoreAutocompleteList(
                successResponse
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
              [
                customerActions.updateCustomerFormStoreAutocompleteList([]),
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

export const saveNewCustomerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(customerActions.saveNewCustomer.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return postWebRequest(
        api.CREATE_NEW_STORE_CUSTOMER,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateTargetStoreCustomersList(
                Array.of(successResponse.body)
              ),
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
              ),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const updateStoreCustomerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(customerActions.updateStoreCustomer.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return putWebRequest(
        api.UPDATE_STORE_CUSTOMER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.closeRightPanel(),
              customerActions.getCustomersListPaginated(),
              customerActions.updateSelectedCustomer(null),
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
              ),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_UPDATE_STORE_CUSTOMER' },
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

export const apiDeleteCustomerByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(customerActions.apiDeleteCustomerById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return deleteWebRequest(api.DELETE_CUSTOMER_BY_ID, state$.value, [
        { key: 'storeCustomerId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(
                new InfoMessage(`Customer successfully deleted.`)
              ),
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
              ),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'DELETE_CUSTOMER_BY_ID' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while deleting сustomer. ${errorResponse}`,
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
