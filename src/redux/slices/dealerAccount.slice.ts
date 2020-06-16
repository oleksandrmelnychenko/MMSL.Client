import { DealerAccount } from './../../interfaces/dealer';
import { createSlice } from '@reduxjs/toolkit';
import { Pagination, PaginationInfo } from '../../interfaces';

const DEALER_ACCOUNT_INIT_STATE: IDalerAccountState = {
  filter: {
    fromDate: undefined,
    toDate: undefined,
    searchWord: '',
  },
  dealers: [],
  pagination: new Pagination(),
};

export interface IDalerAccountState {
  filter: {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    searchWord: string;
  };
  pagination: Pagination;
  dealers: DealerAccount[];
}

const dealerAccount = createSlice({
  name: 'dealerAccount',
  initialState: DEALER_ACCOUNT_INIT_STATE,
  reducers: {
    apiGetDealersPaginatedFlow(state) {
      return state;
    },
    // apiGetDealersPaginatedPage(
    //   state,
    //   action: {
    //     type: string;
    //     payload: {
    //       paginationLimit: number;
    //       paginationPageNumber: number;
    //       searchPhrase: string;
    //       fromDate: Date | undefined;
    //       toDate: Date | undefined;
    //     };
    //   }
    // ) {
    //   return state;
    // },
    apiCreateDealer(state, action) {
      return state;
    },
    apiUpdateDealer(state, action) {
      return state;
    },
    apiDeleteDealerById(state, action: { type: string; payload: number }) {
      return state;
    },
    resetFilter(state) {
      state.filter = {
        fromDate: undefined,
        toDate: undefined,
        searchWord: '',
      };

      return state;
    },
    changeFilterFromDate(
      state,
      action: { type: string; payload: Date | undefined }
    ) {
      state.filter = { ...state.filter, fromDate: action.payload };
      return state;
    },
    changeFilterToDate(
      state,
      action: { type: string; payload: Date | undefined }
    ) {
      state.filter = { ...state.filter, toDate: action.payload };
      return state;
    },
    changeFilterSearchWord(state, action: { type: string; payload: string }) {
      state.filter = { ...state.filter, searchWord: action.payload };
      return state;
    },
    changDealersList(
      state,
      action: { type: string; payload: DealerAccount[] }
    ) {
      state.dealers = action.payload;
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
