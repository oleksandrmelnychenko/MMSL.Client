import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { DealerAccount } from '../../components/dealers/DealerDetails';
import { IDealer } from '../../interfaces';

export class DealerState {
  constructor() {
    this.dealersList = [];
    this.manageDealerForm = new ManageDealerFormState();
    this.selectedDealer = null;
  }

  dealersList: DealerAccount[];
  manageDealerForm: ManageDealerFormState;
  selectedDealer: IDealer | null;
}

export class ManageDealerFormState {
  constructor() {
    this.isFormVisible = false;
  }

  isFormVisible: boolean;
}

export const dealerReducer = createReducer(new DealerState(), (builder) =>
  builder.addCase(dealerActions.updateDealersList, (state, action) => {
    state.dealersList = action.payload;
  })
);
