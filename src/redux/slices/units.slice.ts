import { createSlice } from '@reduxjs/toolkit';
import { PaymentTypeF } from '../../interfaces/paymentTypes';
import { CurrencyType } from '../../interfaces/currencyTypes';

export class UnitsState {
  constructor() {
    this.сurrencies = [];
    this.paymentTypes = [];
  }

  сurrencies: CurrencyType[];
  paymentTypes: PaymentTypeF[];
}

const units = createSlice({
  name: 'units',
  initialState: new UnitsState(),
  reducers: {
    apiGetCurrencies(state) {
      return state;
    },
    apiGetPaymentTypes(state) {
      return state;
    },
    changeCurrencies(state, action) {
      state.сurrencies = action.payload;
      return state;
    },
    changePaymentTypes(state, action) {
      state.paymentTypes = action.payload;
      return state;
    },
    resetWholeState(state) {
      state = new UnitsState();

      return state;
    },
  },
});

export const unitsActions = units.actions;
export default units.reducer;
