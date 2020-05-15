import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { IStore } from '../../interfaces/index';
import { DealerAccount, Pagination } from '../../interfaces';

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
    this.lastOffset = [];
    this.pagination = new Pagination();
    this.search = '';
  }

  dealersList: DealerAccount[];
  lastOffset: DealerAccount[];
  pagination: Pagination;
  search: string;
}

/// Dealer `managing form` dependent state
export class ManageDealerFormState {
  constructor() {
    this.isFormVisible = false;
  }

  isFormVisible: boolean;
}

/// Describes types of `dealer details` components
export enum DealerDetilsComponents {
  DealerDetails,
  DealerAddress,
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

      // state.dealerState.dealersList = state.dealerState.dealersList.concat(
      //   action.payload
      // );
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
    .addCase(dealerActions.setUpdateDealerStore, (state, action) => {
      state.dealerStores = state.dealerStores.map((store) => {
        if (store.id === action.payload.id) {
          store = action.payload;
        }
        return store;
      });
    })
    .addCase(dealerActions.addNewStoreToCurrentDealer, (state, action) => {
      state.dealerStores.push(action.payload);
    })
    .addCase(dealerActions.searchDealer, (state, action) => {
      state.dealerState.search = action.payload;
    })
);
