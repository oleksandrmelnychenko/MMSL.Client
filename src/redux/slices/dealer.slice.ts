import { createSlice } from '@reduxjs/toolkit';
import { StoreCustomer } from '../../interfaces/storeCustomer';
import { IStore } from '../../interfaces/store';
import { DealerAccount } from '../../interfaces/dealer';

export class DealerState {
  constructor() {
    this.selectedDealer = null;
    this.manageDealerForm = new ManageDealerFormState();
    this.isOpenPanelWithDealerDetails = new ToggleDealerPanelWithDetails();
    this.dealerStores = [];
    this.dealerCustomerState = new DealerCustomerState();
  }

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

export class ToggleDealerPanelWithDetails {
  constructor() {
    this.isOpen = false;
    this.componentType = DealerDetilsComponents.Unknown;
  }

  isOpen: boolean;
  componentType: DealerDetilsComponents;
}

const dealer = createSlice({
  name: 'dealer',
  initialState: new DealerState(),
  reducers: {
    getAndSelectDealerById(state, action) {
      return state;
    },
    getStoresByDealer(state, action) {
      return state;
    },
    updateDealerStore(state, action) {
      return state;
    },
    deleteCurrentDealerStore(state, action) {
      return state;
    },
    deleteCurrentCustomerFromStore(state, action) {
      return state;
    },
    addStoreToCurrentDealer(state, action) {
      return state;
    },
    getStoreCustomersByStoreId(state, action) {
      return state;
    },
    updateStoreCustomer(state, action) {
      return state;
    },
    toggleNewDealerForm(state, action) {
      state.manageDealerForm.isFormVisible = action.payload;
      return state;
    },
    setSelectedDealer(state, action) {
      state.selectedDealer = action.payload;
      return state;
    },
    isOpenPanelWithDealerDetails(state, action) {
      state.isOpenPanelWithDealerDetails = action.payload;
      return state;
    },
    setDealerStores(state, action) {
      state.dealerStores = action.payload;
      return state;
    },
    setUpdateDealerStore(state, action) {
      state.dealerStores = state.dealerStores.map((store) => {
        if (store.id === action.payload.id) {
          store = action.payload;
        }
        return store;
      });
      return state;
    },
    addNewStoreToCurrentDealer(state, action) {
      state.dealerStores.push(action.payload);
      return state;
    },
    updateDealerStoresAfterDelete(state, action) {
      state.dealerStores = state.dealerStores.filter(
        (store) => store.id !== action.payload
      );
      return state;
    },
    updateCustomersStoreAfterDeleteCustomer(state, action) {
      state.dealerCustomerState.storeCustomers = state.dealerCustomerState.storeCustomers.filter(
        (customer) => customer.id !== action.payload.id
      );
      return state;
    },
    updateTargetStoreCustomersList(state, action) {
      state.dealerCustomerState.storeCustomers = action.payload;
      return state;
    },
    updateCustomerListAfterUpdateCustomer(state, action) {
      state.dealerCustomerState.storeCustomers = state.dealerCustomerState.storeCustomers.map(
        (customer) => {
          if (customer.id === action.payload.id) {
            customer = action.payload;
          }
          return customer;
        }
      );
      return state;
    },
    setSelectedCustomerInCurrentStore(state, action) {
      state.dealerCustomerState.selectedCustomer = action.payload;
      return state;
    },
  },
});

export const dealerActions = dealer.actions;
export default dealer.reducer;
