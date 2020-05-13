import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { IDealer } from '../../interfaces';

export class DealerState {
  constructor() {
    this.dealersList = [];
  }

  dealersList: IDealer[];
}

export const dealerReducer = createReducer(new DealerState(), (builder) =>
  builder.addCase(dealerActions.updateDealersList, (state, action) => {
    state.dealersList = action.payload;
  })
);
