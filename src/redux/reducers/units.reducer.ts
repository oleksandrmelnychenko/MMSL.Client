import { CurrencyF, PaymentTypeF } from './../../interfaces/index';
import { createReducer } from '@reduxjs/toolkit';
import * as unitsActions from '../actions/units.actions';

export class UnitsState {
  constructor() {
    this.сurrencies = [];
    this.paymentTypes = [];
  }

  сurrencies: CurrencyF[];
  paymentTypes: PaymentTypeF[];
}

export const unitsReducer = createReducer(new UnitsState(), (builder) =>
  builder
    .addCase(unitsActions.setCurrencies, (state, action) => {
      state.сurrencies = action.payload;
    })
    .addCase(unitsActions.setPaymentTypes, (state, action) => {
      state.paymentTypes = action.payload;
    })
);
