import { StoreCustomer } from './../../interfaces/index';
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
    this.dealerCustomerState = new DealerCustomerState();
  }

  dealerState: DealersListState;
  manageDealerForm: ManageDealerFormState;
  selectedDealer: DealerAccount | null;
  isOpenPanelWithDealerDetails: ToggleDealerPanelWithDetails;
  dealerStores: IStore[];
  dealerCustomerState: DealerCustomerState;
}

export class DealerCustomerState {
  constructor() {
    this.storeCustomers = [];
    this.selectedCustomer = null;
  }

  storeCustomers: StoreCustomer[];
  selectedCustomer: StoreCustomer | null;
}

/// Dealer list state (contains list of dealers and pagination)
export class DealersListState {
  constructor() {
    this.dealersList = [];
    this.pagination = new Pagination();
    this.search = '';
    this.fromDate = undefined;
    this.toDate = undefined;
  }

  dealersList: DealerAccount[];
  pagination: Pagination;
  search: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
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
  Unknown,
  DealerDetails,
  DealerAddress,
  DealerStores,
  DealerCustomers,
}

/// Action payload
export class ToggleDealerPanelWithDetails {
  constructor() {
    this.isOpen = false;
    this.componentType = DealerDetilsComponents.Unknown;
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
    .addCase(dealerActions.updateDealerStoresAfterDelete, (state, action) => {
      state.dealerStores = state.dealerStores.filter(
        (store) => store.id !== action.payload
      );
    })
    .addCase(
      dealerActions.updateCustomersStoreAfterDeleteCustomer,
      (state, action) => {
        state.dealerCustomerState.storeCustomers = state.dealerCustomerState.storeCustomers.filter(
          (customer) => customer.id !== action.payload.id
        );
      }
    )
    .addCase(dealerActions.updateTargetStoreCustomersList, (state, action) => {
      state.dealerCustomerState.storeCustomers = action.payload;
    })
    .addCase(
      dealerActions.updateCustomerListAfterUpdateCustomer,
      (state, action) => {
        state.dealerCustomerState.storeCustomers = state.dealerCustomerState.storeCustomers.map(
          (customer) => {
            if (customer.id === action.payload.id) {
              customer = action.payload;
            }
            return customer;
          }
        );
      }
    )
    .addCase(
      dealerActions.setSelectedCustomerInCurrentStore,
      (state, action) => {
        state.dealerCustomerState.selectedCustomer = action.payload;
      }
    )
    .addCase(dealerActions.dealeFromDate, (state, action) => {
      state.dealerState.fromDate = action.payload;
    })
    .addCase(dealerActions.dealeToDate, (state, action) => {
      state.dealerState.toDate = action.payload;
    })
);
