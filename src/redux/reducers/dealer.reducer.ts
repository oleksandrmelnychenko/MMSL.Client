import { createReducer } from '@reduxjs/toolkit';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { DealerAccount } from '../../components/dealers/DealerDetails';

export class DealerState {
  constructor() {
    this.dealersList = [];
    this.manageDealerForm = new ManageDealerFormState();
  }

  dealersList: DealerAccount[];
  manageDealerForm: ManageDealerFormState;
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
