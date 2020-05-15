import { createAction } from '@reduxjs/toolkit';
import * as customerTypes from '../../constants/customer.types.constants';
import { StoreCustomer, PaginationInfo } from '../../interfaces/index';

export const getCustomersListPaginated = createAction(
  customerTypes.GET_CUSTOMERS_LIST_PAGINATED
);

export const updateCustomersList = createAction<StoreCustomer[]>(
  customerTypes.UPDATE_CUSTOMERS_LIST
);

export const updateCustomersListPaginationInfo = createAction<PaginationInfo>(
  customerTypes.UPDATE_CUSTOMERS_LIST_PAGINATION_INFO
);

export const searchCustomer = createAction<string>(
  customerTypes.SEARCH_CUSTOMER
);

export type GetCustomersListPaginated = ReturnType<
  typeof getCustomersListPaginated
>;
export type UpdateCustomersList = ReturnType<typeof updateCustomersList>;

export type UpdateCustomersListPaginationInfo = ReturnType<
  typeof updateCustomersListPaginationInfo
>;
export type SearchCustomer = ReturnType<typeof searchCustomer>;
