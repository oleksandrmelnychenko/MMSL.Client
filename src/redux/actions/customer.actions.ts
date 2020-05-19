import { createAction } from '@reduxjs/toolkit';
import * as customerTypes from '../constants/customer.types.constants';
import { StoreCustomer, PaginationInfo, IStore } from '../../interfaces/index';

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
export const searchCustomerByStore = createAction<string>(
  customerTypes.SEARCH_CUSTOMER_BY_STORE
);
export const toggleNewCustomerForm = createAction<boolean>(
  customerTypes.TOGGLE_NEW_CUSTOMER_FORM
);
export const customerFormStoreAutocompleteText = createAction<string>(
  customerTypes.CUSTOMER_FORM_STORE_AUTOCOMPLETE_TEXT
);
export const updateCustomerFormStoreAutocompleteList = createAction<IStore[]>(
  customerTypes.UPDATE_CUSTOMER_FORM_STORE_AUTOCOMPLETE_LIST
);
export const saveNewCustomer = createAction<StoreCustomer>(
  customerTypes.SAVE_NEW_CUSTOMER
);

export type GetCustomersListPaginated = ReturnType<
  typeof getCustomersListPaginated
>;
export type UpdateCustomersList = ReturnType<typeof updateCustomersList>;

export type UpdateCustomersListPaginationInfo = ReturnType<
  typeof updateCustomersListPaginationInfo
>;
export type SearchCustomer = ReturnType<typeof searchCustomer>;
export type SearchCustomerByStore = ReturnType<typeof searchCustomerByStore>;
export type UpdateCustomerFormStoreAutocompleteList = ReturnType<
  typeof updateCustomerFormStoreAutocompleteList
>;
export type SaveNewCustomer = ReturnType<typeof saveNewCustomer>;
