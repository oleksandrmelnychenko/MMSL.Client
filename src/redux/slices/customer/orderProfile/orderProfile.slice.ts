import { ProductCategory } from './../../../../interfaces/products';
import { CustomerProductProfile } from './../../../../interfaces/orderProfile';
import { createSlice } from '@reduxjs/toolkit';

export interface IOrderProfileState {
  targetOrderProfile: CustomerProductProfile | null | undefined;
  customerProductProfiles: ProductCategory[];
  selectedProductProfiles: ProductCategory | null | undefined;
}

const INIT_STATE: IOrderProfileState = {
  targetOrderProfile: null,
  customerProductProfiles: [],
  selectedProductProfiles: null,
};

const orderProfile = createSlice({
  name: 'orderProfile',
  initialState: INIT_STATE,

  reducers: {
    apiGetOrderProfiles(state) {},
    apiCreateOrderProfile(state, action: { type: string; payload: any }) {},
    apiDeleteOrderProfileById(
      state,
      action: { type: string; payload: number }
    ) {},
    apiUpdateOrderProfile(state, action: { type: string; payload: any }) {},
    apiGetOrderProfileById(state, action: { type: string; payload: number }) {},
    apiGetProductProfilesByCutomerId(
      state,
      action: { type: string; payload: number }
    ) {},
    changeTargetOrderProfile(
      state,
      action: {
        type: string;
        payload: CustomerProductProfile | null | undefined;
      }
    ) {
      state.targetOrderProfile = action.payload;
      return state;
    },
    changeCustomerProductProfiles(
      state,
      action: { type: string; payload: ProductCategory[] }
    ) {
      state.customerProductProfiles = action.payload;
      return state;
    },
    changeSelectedProductProfiles(
      state,
      action: {
        type: string;
        payload: ProductCategory | null | undefined;
      }
    ) {
      state.selectedProductProfiles = action.payload;
      return state;
    },
  },
});

export const orderProfileActions = orderProfile.actions;
export default orderProfile.reducer;
