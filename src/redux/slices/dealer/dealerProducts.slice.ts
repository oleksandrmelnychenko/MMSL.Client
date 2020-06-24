import { createSlice } from '@reduxjs/toolkit';

export interface IDealerProductsState {}

const dealerProducts = createSlice({
  name: 'dealerProducts',
  initialState: {},

  reducers: {
    apiGetDealerProducts(state, action: { type: string; payload: number }) {
      return state;
    },
    apiUpdateProductsAvailability(
      state,
      action: { type: string; payload: any[] }
    ) {
      return state;
    },
  },
});

export const dealerProductsActions = dealerProducts.actions;
export default dealerProducts.reducer;
