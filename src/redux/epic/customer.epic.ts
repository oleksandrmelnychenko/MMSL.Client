import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractSuccessPendingActions,
  extractErrorPendingActions,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import * as customerActions from '../../redux/actions/customer.actions';
import { from } from 'rxjs';
import * as customerTypes from '../../constants/customer.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import { ajaxGetWebResponse } from '../../helpers/epic.helper';
import * as api from '../../constants/api.constants';
import { Pagination } from '../../interfaces';

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
