import { StoreCustomer } from './../../interfaces/index';
import { createReducer } from '@reduxjs/toolkit';
import * as customerActions from '../../redux/actions/customer.actions';
import { DealerAccount, Pagination } from '../../interfaces';

/// Customer reducer state
export class CustomerState {
  constructor() {
    this.customerState = new CustomerListState();
  }

  customerState: CustomerListState;
}

/// Customer list state (contains list of customers and pagination)
export class CustomerListState {
  constructor() {
    this.customersList = [];
    this.lastOffset = [];
    this.pagination = new Pagination();
    this.search = '';
  }

  customersList: StoreCustomer[];
  lastOffset: DealerAccount[];
  pagination: Pagination;
  search: string;
}

export const customerReducer = createReducer(new CustomerState(), (builder) =>
  builder
    .addCase(customerActions.updateCustomersList, (state, action) => {
      state.customerState.customersList = action.payload;
    })
    .addCase(
      customerActions.updateCustomersListPaginationInfo,
      (state, action) => {
        state.customerState.pagination.paginationInfo = action.payload;
      }
    )
    .addCase(customerActions.searchCustomer, (state, action) => {
      state.customerState.search = action.payload;
    })
);
