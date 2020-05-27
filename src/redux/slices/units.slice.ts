import { createSlice } from '@reduxjs/toolkit';
import { CurrencyF, PaymentTypeF } from '../../interfaces';

export class UnitsState {
  constructor() {
    this.сurrencies = [];
    this.paymentTypes = [];
  }

  сurrencies: CurrencyF[];
  paymentTypes: PaymentTypeF[];
}

const units = createSlice({
  name: 'units',
  initialState: new UnitsState(),
  reducers: {
    setCurrencies(state, action) {
      state.сurrencies = action.payload;
      return state;
    },
    setPaymentTypes(state, action) {
      state.paymentTypes = action.payload;
      return state;
    },

    getCurrencies(state) {
      return state;
    },
    getPaymentTypes(state) {
      return state;
    },
  },
});

export const unitsActions = units.actions;
export default units.reducer;
