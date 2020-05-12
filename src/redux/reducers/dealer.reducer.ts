import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { IDealer } from '../../interfaces';

export enum DealerView {
  List,
  Details,
  Stores,
}

export class DealerState {
  constructor() {
    this.selectedView = DealerView.List;
    this.dealersList = [];
  }

  selectedView: DealerView;
  dealersList: IDealer[];
}

export const dealerReducer = createReducer(new DealerState(), (builder) =>
  builder
    .addCase(dealerActions.changeDealerView, (state, action) => {
      state.selectedView = action.payload;
    })
    .addCase(dealerActions.updateDealersList, (state, action) => {
      state.dealersList = action.payload;
    })
);
