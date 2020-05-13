import { createAction } from '@reduxjs/toolkit';
import * as dealerTypes from '../../constants/dealer.types.constants';
import { DealerAccount, PaginationInfo } from '../../interfaces/index';

export const getDealersList = createAction(dealerTypes.GET_DEALERS_LIST);

export const getDealersListPaginated = createAction(
  dealerTypes.GET_DEALERS_LIST_PAGINATED
);

export const updateDealersList = createAction<DealerAccount[]>(
  dealerTypes.UPDATE_DEALERS_LIST
);

export const saveNewDealer = createAction<DealerAccount>(
  dealerTypes.SAVE_NEW_DEALER
);

export const getStoresByDealer = createAction<number>(
  dealerTypes.GET_STORES_BY_DEALER
);

export const toggleNewDealerForm = createAction<boolean>(
  dealerTypes.TOGGLE_NEW_DEALER_FORM
);

export const setSelectedDealer = createAction<DealerAccount>(
  dealerTypes.SELECTED_DEALER
);

export const updateDealerListPagination = createAction<PaginationInfo>(
  dealerTypes.UPDATE_DEALER_LIST_PAGINATION
);

export const setDealerStores = createAction<any>(dealerTypes.SET_DEALER_STORES);

export const isOpenPanelWithDealerDetails = createAction<boolean>(
  dealerTypes.IS_OPEN_PANEL_WITH_DEALER_DETAILS
);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type GetDealersListPaginated = ReturnType<
  typeof getDealersListPaginated
>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
export type SaveNewDealer = ReturnType<typeof saveNewDealer>;
export type ToggleNewDealerForm = ReturnType<typeof toggleNewDealerForm>;
export type SetSelectedDealer = ReturnType<typeof setSelectedDealer>;
export type UpdateDealerListPagination = ReturnType<
  typeof updateDealerListPagination
>;
