import { createAction } from '@reduxjs/toolkit';
import * as dealerTypes from '../../constants/dealer.types.constants';
import { DealerAccount } from '../../components/dealers/DealerDetails';
import { IDealer } from '../../interfaces/index';

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

export const setSelectedDealer = createAction<IDealer>(
  dealerTypes.SELECTED_DEALER
);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
export type SaveNewDealer = ReturnType<typeof saveNewDealer>;
export type ToggleNewDealerForm = ReturnType<typeof toggleNewDealerForm>;
export type SetSelectedDealer = ReturnType<typeof setSelectedDealer>;
