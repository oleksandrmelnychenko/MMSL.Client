import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';

export enum DealerView {
  List,
  Details,
  Stores,
}

export class DealerState {
  constructor() {
    this.selectedView = DealerView.List;
  }

  selectedView: DealerView;
}

export const dealerReducer = createReducer(new DealerState(), (builder) =>
  builder.addCase(dealerActions.changeDealerView, (state, action) => {
    state.selectedView = action.payload;
  })
);
