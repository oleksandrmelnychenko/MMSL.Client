import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { debounceTime, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { customerActions } from '../../redux/slices/customer.slice';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxGetWebResponse,
  ajaxPostResponse,
  ajaxPutResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import { controlActions } from '../slices/control.slice';
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
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      /// TODO: support pagination for customers
      return ajaxGetWebResponse(api.GET_CUSTOMERS_ALL, state$.value, [
        { key: 'pageNumber', value: `1` },
        { key: 'limit', value: `9999` },
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
      return ajaxGetWebResponse(api.GET_ALL_STORES, state$.value, [
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
      return ajaxPostResponse(
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
              controlActions.showInfoMessage(successResponse.message),
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
      return ajaxPutResponse(
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
              customerActions.selectedCustomer(null),
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(successResponse.message),
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
