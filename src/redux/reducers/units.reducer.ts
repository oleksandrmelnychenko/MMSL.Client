import { CurrencyF } from './../../interfaces/index';
import { createReducer } from '@reduxjs/toolkit';
import * as unitsActions from '../../redux/actions/units.actons';

/// Dealer reducer state
export class UnitsState {
  constructor() {
    this.сurrencies = [];
  }

  сurrencies: CurrencyF[];
}

export const unitsReducer = createReducer(new UnitsState(), (builder) =>
  builder.addCase(unitsActions.setCurrencies, (state, action) => {})
);
