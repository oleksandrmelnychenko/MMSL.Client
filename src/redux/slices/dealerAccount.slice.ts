import { DealerAccount } from './../../interfaces/dealer';
import { createSlice } from '@reduxjs/toolkit';
import { Pagination } from '../../interfaces';

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
    apiGetDealersPaginated(state) {
      return state;
    },
    apiGetDealersPaginatedPage(
      state,
      action: {
        type: string;
        payload: {
          paginationLimit: number;
          paginationPageNumber: number;
          searchPhrase: string;
          fromDate: Date | undefined;
          toDate: Date | undefined;
        };
      }
    ) {
      return state;
    },
    apiDeleteDealerById(state, action: { type: string; payload: number }) {
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
    changePagination(state, action: { type: string; payload: Pagination }) {
      state.pagination = { ...action.payload };
      return state;
    },
    // updateDealerListPaginationInfo(state, action) {
    //   let newPagination = { ...state.dealerState.pagination };
    //   newPagination.paginationInfo = action.payload;

    //   state.dealerState.pagination = newPagination;
    //   return state;
    // },
    // updateDealersList(state, action) {
    //   state.dealerState.dealersList = action.payload;
    //   return state;
    // },
  },
});

export const dealerAccountActions = dealerAccount.actions;
export default dealerAccount.reducer;
