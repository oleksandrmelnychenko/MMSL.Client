import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  IDealer,
  DealerAccount,
  PaginationInfo,
  Pagination,
} from '../../interfaces';

/// Dealer reducer state
export class DealerState {
  constructor() {
    this.selectedDealer = null;
    this.manageDealerForm = new ManageDealerFormState();
    this.dealerState = new DealersListState();
  }

  dealerState: DealersListState;
  manageDealerForm: ManageDealerFormState;
  selectedDealer: DealerAccount | null;
}

/// Dealer list state (contains list of dealers and pagination)
export class DealersListState {
  constructor() {
    this.dealersList = [];
    this.pagination = new Pagination();
  }

  dealersList: DealerAccount[];
  pagination: Pagination;
}

/// Dealer `managing form` dependent state
export class ManageDealerFormState {
  constructor() {
    this.isFormVisible = false;
  }

  isFormVisible: boolean;
}

export const dealerReducer = createReducer(new DealerState(), (builder) =>
  builder
    .addCase(dealerActions.updateDealersList, (state, action) => {
      state.dealerState.dealersList = action.payload;
    })
    .addCase(dealerActions.toggleNewDealerForm, (state, action) => {
      state.manageDealerForm.isFormVisible = action.payload;
    })
    .addCase(dealerActions.setSelectedDealer, (state, action) => {
      state.selectedDealer = action.payload;
    })
    .addCase(dealerActions.updateDealerListPagination, (state, action) => {
      state.dealerState.pagination = action.payload;
    })
    .addCase(dealerActions.updateDealerListPaginationInfo, (state, action) => {
      state.dealerState.pagination.paginationInfo = action.payload;
    })
);
