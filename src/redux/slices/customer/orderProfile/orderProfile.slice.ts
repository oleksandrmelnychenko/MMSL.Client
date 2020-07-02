import { ProductCategory } from './../../../../interfaces/products';
import { CustomerProductProfile } from './../../../../interfaces/orderProfile';
import { createSlice } from '@reduxjs/toolkit';

export enum MainProfileView {
  ExploreProfileList,
  ExploreSingleProfile,
  CreatingNewProfile,
}

export interface IOrderProfileState {
  /// TODO: remove
  orderProfiles: CustomerProductProfile[];
  targetOrderProfile: CustomerProductProfile | null | undefined;
  customerProductProfiles: ProductCategory[];
  mainProfileView: MainProfileView;
}

const INIT_STATE: IOrderProfileState = {
  /// TODO: remove
  orderProfiles: [],
  targetOrderProfile: null,
  customerProductProfiles: [],
  mainProfileView: MainProfileView.ExploreProfileList,
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
    /// TODO: remove
    changeOrderProfiles(
      state,
      action: { type: string; payload: CustomerProductProfile[] }
    ) {
      state.orderProfiles = action.payload;
      return state;
    },
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
    changeMainProfileView(
      state,
      action: { type: string; payload: MainProfileView }
    ) {
      state.mainProfileView = action.payload;
      return state;
    },
  },
});

export const orderProfileActions = orderProfile.actions;
export default orderProfile.reducer;
