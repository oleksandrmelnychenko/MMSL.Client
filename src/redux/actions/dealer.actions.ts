import { createAction } from '@reduxjs/toolkit';
import * as dealerTypes from '../../constants/dealer.types.constants';
import { DealerAccount } from '../../interfaces/index';

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

export const setSelectedDealer = createAction<DealerAccount>(
  dealerTypes.SELECTED_DEALER
);

export const getStoresByDealer = createAction<number>(
  dealerTypes.GET_STORES_BY_DEALER
);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
export type SaveNewDealer = ReturnType<typeof saveNewDealer>;
export type ToggleNewDealerForm = ReturnType<typeof toggleNewDealerForm>;
export type SetSelectedDealer = ReturnType<typeof setSelectedDealer>;
