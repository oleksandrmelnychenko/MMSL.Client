import { ManageDealerForm } from './../../components/dealers/ManageDealerForm';
import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { IStore } from '../../interfaces/index';
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
    this.isOpenPanelWithDealerDetails = new ToggleDealerPanelWithDetails();
    this.dealerStores = [];
  }

  dealerState: DealersListState;
  manageDealerForm: ManageDealerFormState;
  selectedDealer: DealerAccount | null;
  isOpenPanelWithDealerDetails: ToggleDealerPanelWithDetails;
  dealerStores: IStore[];
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
    this.isIpdatingDealer = false;
  }

  isFormVisible: boolean;
  isIpdatingDealer: boolean;
}

/// Describes types of `dealer details` components
export enum DealerDetilsComponents {
  DealerDetails,
  DealerStores,
}

/// Action payload
export class ToggleDealerPanelWithDetails {
  constructor() {
    this.isOpen = false;
    this.componentType = DealerDetilsComponents.DealerDetails;
  }

  isOpen: boolean;
  componentType: DealerDetilsComponents;
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
    .addCase(dealerActions.isOpenPanelWithDealerDetails, (state, action) => {
      state.isOpenPanelWithDealerDetails = action.payload;
    })
    .addCase(dealerActions.setDealerStores, (state, action) => {
      state.dealerStores = action.payload;
    })
    .addCase(dealerActions.toggleUpdatingDealer, (state, action) => {
      let dealerForm = { ...state.manageDealerForm };
      dealerForm.isIpdatingDealer = action.payload;
      state.manageDealerForm = dealerForm;
    })
);
