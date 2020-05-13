import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { DealerAccount } from '../../interfaces';

export class DealerState {
  constructor() {
    this.dealersList = [];
    this.manageDealerForm = new ManageDealerFormState();
    this.selectedDealer = new DealerAccount();
  }

  dealersList: DealerAccount[];
  manageDealerForm: ManageDealerFormState;
  selectedDealer: DealerAccount;
}

export class ManageDealerFormState {
  constructor() {
    this.isFormVisible = false;
  }

  isFormVisible: boolean;
}

export const dealerReducer = createReducer(new DealerState(), (builder) =>
  builder
    .addCase(dealerActions.updateDealersList, (state, action) => {
      state.dealersList = action.payload;
    })
    .addCase(dealerActions.toggleNewDealerForm, (state, action) => {
      state.manageDealerForm.isFormVisible = action.payload;
    })
    .addCase(dealerActions.setSelectedDealer, (state, action) => {
      state.selectedDealer = action.payload;
    })
);
