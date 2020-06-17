import { DealerAccount } from './../../interfaces/dealer';
import { createSlice } from '@reduxjs/toolkit';
import { Pagination, PaginationInfo } from '../../interfaces';
import { parseDateToString } from '../../helpers/date.helper';

const DEALER_ACCOUNT_INIT_STATE: IDalerAccountState = {
  filter: {
    fromDate: undefined,
    toDate: undefined,
    searchWord: '',
  },
  dealers: [],
  pagination: new Pagination(),
  targetDealer: null,
};

export interface IDalerAccountState {
  filter: {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    searchWord: string;
  };
  pagination: Pagination;
  dealers: DealerAccount[];
  targetDealer: DealerAccount | null;
}

const dealerAccount = createSlice({
  name: 'dealerAccount',
  initialState: DEALER_ACCOUNT_INIT_STATE,
  reducers: {
    apiGetDealersPaginatedFlow(state) {
      return state;
    },
    apiGetDealerById(state, action: { type: string; payload: number }) {
      return state;
    },
    apiCreateDealer(state, action) {
      return state;
    },
    apiUpdateDealer(state, action) {
      return state;
    },
    apiDeleteDealerById(state, action: { type: string; payload: number }) {
      return state;
    },
    changDealersList(
      state,
      action: { type: string; payload: DealerAccount[] }
    ) {
      state.dealers = action.payload;
      return state;
    },
    changeTargetDealer(
      state,
      action: { type: string; payload: DealerAccount | null }
    ) {
      state.targetDealer = action.payload;
      return state;
    },
    changeFilterFromDate(
      state,
      action: { type: string; payload: Date | undefined }
    ) {
      if (
        parseDateToString(action.payload) !==
        parseDateToString(state.filter.fromDate)
      ) {
        state.pagination.paginationInfo = new PaginationInfo();
        state.dealers = [];
      }

      state.filter = { ...state.filter, fromDate: action.payload };

      return state;
    },
    changeFilterToDate(
      state,
      action: { type: string; payload: Date | undefined }
    ) {
      if (
        parseDateToString(action.payload) !==
        parseDateToString(state.filter.toDate)
      ) {
        state.pagination.paginationInfo = new PaginationInfo();
        state.dealers = [];
      }

      state.filter = { ...state.filter, toDate: action.payload };

      return state;
    },
    changeFilterSearchWord(state, action: { type: string; payload: string }) {
      if (action.payload !== state.filter.searchWord) {
        state.pagination.paginationInfo = new PaginationInfo();
        state.dealers = [];
      }

      state.filter = { ...state.filter, searchWord: action.payload };

      return state;
    },
    changePagination(state, action: { type: string; payload: Pagination }) {
      state.pagination = { ...action.payload };
      return state;
    },
    changePaginationInfo(
      state,
      action: { type: string; payload: PaginationInfo }
    ) {
      const newPagination = {
        ...state.pagination,
        paginationInfo: action.payload,
      };

      state.pagination = newPagination;
      return state;
    },
  },
});

export const dealerAccountActions = dealerAccount.actions;
export default dealerAccount.reducer;
