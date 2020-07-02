import { createSlice } from '@reduxjs/toolkit';
import { StoreCustomer } from '../../../../interfaces/storeCustomer';
import { ProductCategory } from '../../../../interfaces/products';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';

export interface IProfileManagingState {
  isManaging: boolean;
  customer: StoreCustomer | null | undefined;
  product: ProductCategory | null | undefined;
  commands: ICommand[];
}

const INIT_STATE: IProfileManagingState = {
  isManaging: false,
  customer: null,
  product: null,
  commands: [],
};

export interface ICommand {
  name: string;
  isDisabled: boolean;
  className: string;
  onClick: () => void;
}

const profileManaging = createSlice({
  name: 'profileManaging',
  initialState: INIT_STATE,

  reducers: {
    beginManaging(
      state,
      action: {
        type: string;
        payload: {
          profileForEdit: CustomerProductProfile | null | undefined;
          customer: StoreCustomer;
          product: ProductCategory;
        };
      }
    ) {
      state.isManaging = true;
      state.customer = action.payload.customer;
      state.product = action.payload.product;
      state.commands = [];

      return state;
    },
    stopManaging(state) {
      state.isManaging = false;
      state.customer = null;
      state.product = null;
      state.commands = [];

      return state;
    },
    updateCommands(state, action: { type: string; payload: ICommand[] }) {
      state.commands = action.payload;
      return state;
    },
  },
});

export const profileManagingActions = profileManaging.actions;
export default profileManaging.reducer;
