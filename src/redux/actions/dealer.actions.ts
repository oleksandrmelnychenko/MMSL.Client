import { createAction } from '@reduxjs/toolkit';
import * as dealerTypes from '../../constants/dealer.types.constants';
import {
  DealerAccount,
  Pagination,
  PaginationInfo,
  IStore,
  INewStore,
} from '../../interfaces/index';
import { ToggleDealerPanelWithDetails } from '../reducers/dealer.reducer';

export const getDealersList = createAction(dealerTypes.GET_DEALERS_LIST);

export const getDealersListPaginated = createAction(
  dealerTypes.GET_DEALERS_LIST_PAGINATED
);

export const getAndSelectDealerById = createAction<number>(
  dealerTypes.GET_AND_SELECT_DEALER_BY_ID
);

export const updateDealersList = createAction<DealerAccount[]>(
  dealerTypes.UPDATE_DEALERS_LIST
);

export const saveNewDealer = createAction<DealerAccount>(
  dealerTypes.SAVE_NEW_DEALER
);

export const updateDealer = createAction<DealerAccount>(
  dealerTypes.UPDATE_DEALER
);

export const getStoresByDealer = createAction<number>(
  dealerTypes.GET_STORES_BY_DEALER
);

export const toggleNewDealerForm = createAction<boolean>(
  dealerTypes.TOGGLE_NEW_DEALER_FORM
);

export const setSelectedDealer = createAction<DealerAccount | null>(
  dealerTypes.SELECTED_DEALER
);

export const updateDealerListPagination = createAction<Pagination>(
  dealerTypes.UPDATE_DEALER_LIST_PAGINATION
);
export const updateDealerListPaginationInfo = createAction<PaginationInfo>(
  dealerTypes.UPDATE_DEALER_LIST_PAGINATION_INFO
);

export const updateDealerStore = createAction<IStore>(
  dealerTypes.UPDATE_DEALER_STORE
);

export const setUpdateDealerStore = createAction<IStore>(
  dealerTypes.SET_UPDATE_DEALER_STORE
);

export const addNewStoreToCurrentDealer = createAction<IStore>(
  dealerTypes.ADD_NEW_STORE_TO_CURRENT_DEALER
);

export const setDealerStores = createAction<any>(dealerTypes.SET_DEALER_STORES);

export const addStoreToCurrentDealer = createAction<INewStore>(
  dealerTypes.ADD_STORE_TO_CURRENT_DEALER
);

export const searchDealer = createAction<string>(dealerTypes.SEARCH_DEALER);

export const isOpenPanelWithDealerDetails = createAction<
  ToggleDealerPanelWithDetails
>(dealerTypes.IS_OPEN_PANEL_WITH_DEALER_DETAILS);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type GetDealersListPaginated = ReturnType<
  typeof getDealersListPaginated
>;
export type GetAndSelectDealerById = ReturnType<typeof getAndSelectDealerById>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
export type SaveNewDealer = ReturnType<typeof saveNewDealer>;
export type ToggleNewDealerForm = ReturnType<typeof toggleNewDealerForm>;
export type SetSelectedDealer = ReturnType<typeof setSelectedDealer>;
export type UpdateDealerListPagination = ReturnType<
  typeof updateDealerListPagination
>;
export type updateDealerListPaginationInfo = ReturnType<
  typeof updateDealerListPagination
>;
export type SearchDealer = ReturnType<typeof searchDealer>;
