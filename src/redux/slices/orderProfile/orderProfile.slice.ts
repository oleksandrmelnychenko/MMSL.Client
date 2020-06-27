import { CustomerProductProfile } from './../../../interfaces/orderProfile';
import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IOrderProfileState = {
  orderProfiles: [],
  targetOrderProfile: null,
};

export interface IOrderProfileState {
  orderProfiles: CustomerProductProfile[];
  targetOrderProfile: CustomerProductProfile | null | undefined;
}

const orderProfile = createSlice({
  name: 'orderProfile',
  initialState: INIT_STATE,

  reducers: {
    apiGetOrderProfiles(state) {
      return state;
    },
    apiCreateOrderProfile(state, action: { type: string; payload: any }) {
      return state;
    },
    apiDeleteOrderProfileById(
      state,
      action: { type: string; payload: number }
    ) {
      return state;
    },
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
  },
});

export const orderProfileActions = orderProfile.actions;
export default orderProfile.reducer;
