import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractSuccessPendingActions,
  extractErrorPendingActions,
} from './../../helpers/action.helper';
import { debounceTime, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import * as customerActions from '../../redux/actions/customer.actions';
import { from } from 'rxjs';
import * as customerTypes from '../../constants/customer.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxGetWebResponse,
  ajaxPostResponse,
} from '../../helpers/epic.helper';
import * as api from '../../constants/api.constants';
import { Pagination } from '../../interfaces';
import * as controlActions from '../../redux/actions/control.actions';
import * as dealerActions from '../../redux/actions/dealer.actions';

export const getCustomersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(customerTypes.GET_CUSTOMERS_LIST_PAGINATED),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;

      return ajaxGetWebResponse(api.GET_CUSTOMERS_ALL, state$.value, [
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
          let successResultFlow = [
            customerActions.updateCustomersList(successResponse.entities),
            customerActions.updateCustomersListPaginationInfo(
              successResponse.paginationInfo
            ),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              { type: 'ERROR_GET_CUSTOMERS_LIST' },
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
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
    ofType(customerTypes.CUSTOMER_FORM_STORE_AUTOCOMPLETE_TEXT),
    debounceTime(300),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return ajaxGetWebResponse(api.GET_ALL_STORES, state$.value, [
        {
          key: 'searchPhrase',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            customerActions.updateCustomerFormStoreAutocompleteList(
              successResponse
            ),

            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              customerActions.updateCustomerFormStoreAutocompleteList([]),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const saveNewCustomerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(customerTypes.SAVE_NEW_CUSTOMER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPostResponse(
        api.CREATE_NEW_STORE_CUSTOMER,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            dealerActions.updateTargetStoreCustomersList(
              Array.of(successResponse.body)
            ),
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
