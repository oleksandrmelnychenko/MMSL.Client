import { createAction } from '@reduxjs/toolkit';
import * as customerTypes from '../../constants/customer.types.constants';
import { StoreCustomer } from '../../interfaces/index';

export const getCustomersListPaginated = createAction(
  customerTypes.GET_CUSTOMERS_LIST_PAGINATED
);

export const updateCustomersList = createAction<StoreCustomer[]>(
  customerTypes.UPDATE_CUSTOMERS_LIST
);

export type GetCustomersListPaginated = ReturnType<
  typeof getCustomersListPaginated
>;
export type UpdateCustomersList = ReturnType<typeof updateCustomersList>;
