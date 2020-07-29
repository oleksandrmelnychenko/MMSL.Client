import { createSlice } from '@reduxjs/toolkit';
import { StoreCustomer } from '../../../../interfaces/storeCustomer';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';

export interface IProfileManagingState {
  isManaging: boolean;
  customer: StoreCustomer | null | undefined;
  productId: number;
  profileForEdit: CustomerProductProfile | null | undefined;
  profileToReplicate: CustomerProductProfile | null | undefined;
}

const INIT_STATE: IProfileManagingState = {
  isManaging: false,
  customer: null,
  productId: 0,
  profileForEdit: null,
  profileToReplicate: null,
};

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
          productId: number;
          profileToReplicate: CustomerProductProfile | null | undefined;
        };
      }
    ) {
      state.isManaging = true;
      state.customer = action.payload.customer;
      state.productId = action.payload.productId;
      state.profileForEdit = action.payload.profileForEdit;
      state.profileToReplicate = action.payload.profileToReplicate;

      return state;
    },
    stopManaging(state) {
      state.isManaging = false;
      state.customer = null;
      state.productId = 0;
      state.profileForEdit = null;
      state.profileToReplicate = null;

      return state;
    },
  },
});

export const profileManagingActions = profileManaging.actions;
export default profileManaging.reducer;
