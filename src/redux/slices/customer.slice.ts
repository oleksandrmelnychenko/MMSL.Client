import { createSlice } from '@reduxjs/toolkit';
import { Pagination } from '../../interfaces';
import { StoreCustomer } from '../../interfaces/storeCustomer';
import { IStore } from '../../interfaces/store';

export class CustomerState {
  constructor() {
    this.customerState = new CustomerListState();
    this.manageCustomerForm = new ManageCustomerFormState();
  }

  manageCustomerForm: ManageCustomerFormState;
  customerState: CustomerListState;
}

export class CustomerListState {
  constructor() {
    this.customersList = [];
    this.pagination = new Pagination();
    this.selectedCustomer = null;
    this.search = '';
    this.searchByStore = '';
  }

  customersList: StoreCustomer[];
  selectedCustomer: StoreCustomer | null;
  pagination: Pagination;
  search: string;
  searchByStore: string;
}

export class ManageCustomerFormState {
  constructor() {
    this.storesAutocomplete = [];
  }
  storesAutocomplete: IStore[];
}

const customer = createSlice({
  name: 'customer',
  initialState: new CustomerState(),
  reducers: {
    apiDeleteCustomerById(state, action: { type: string; payload: number }) {},
    apigetAllCustomers(state) {},
    getCustomersListPaginated(state) {},
    customerFormStoreAutocompleteText(state, action) {},
    updateStoreCustomer(state, action) {},
    saveNewCustomer(state, action) {},
    updateCustomersList(state, action) {
      state.customerState.customersList = action.payload;
      return state;
    },
    updateCustomersListPaginationInfo(state, action) {
      state.customerState.pagination.paginationInfo = action.payload;
      return state;
    },
    searchCustomer(state, action) {
      state.customerState.search = action.payload;
      return state;
    },
    searchCustomerByStore(state, action) {
      state.customerState.searchByStore = action.payload;
      return state;
    },
    selectedCustomer(state, action) {
      state.customerState.selectedCustomer = action.payload;
      return state;
    },
    updateCustomerFormStoreAutocompleteList(state, action) {
      state.manageCustomerForm.storesAutocomplete = action.payload;
      return state;
    },
    resetWholeState(state) {
      state = new CustomerState();

      return state;
    },
  },
});

export const customerActions = customer.actions;
export default customer.reducer;
