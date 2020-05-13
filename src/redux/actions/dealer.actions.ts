import * as dealerTypes from '../../constants/dealer.types.constants';
import { createAction } from '@reduxjs/toolkit';
import { DealerAccount } from '../../components/dealers/DealerDetails';

export const getDealersList = createAction(dealerTypes.GET_DEALERS_LIST);

export const updateDealersList = createAction<DealerAccount[]>(
  dealerTypes.UPDATE_DEALERS_LIST
);

export const saveNewDealer = createAction<DealerAccount>(
  dealerTypes.SAVE_NEW_DEALER
);

export const toggleNewDealerForm = createAction<boolean>(
  dealerTypes.TOGGLE_NEW_DEALER_FORM
);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
export type SaveNewDealer = ReturnType<typeof saveNewDealer>;
export type ToggleNewDealerForm = ReturnType<typeof toggleNewDealerForm>;
