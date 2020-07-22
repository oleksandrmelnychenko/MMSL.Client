import { Fabric, FilterItem } from './../../../../interfaces/fabric';
import { createSlice } from '@reduxjs/toolkit';
import { Pagination, PaginationInfo } from '../../../../interfaces';

const INIT_STATE: IFabricState = {
  fabrics: [],
  targetFabric: null,
  pagination: new Pagination(),
  searchWord: '',
  filters: [],
};

export interface IFabricState {
  fabrics: Fabric[];
  targetFabric: Fabric | null | undefined;
  pagination: Pagination;
  searchWord: string;
  filters: FilterItem[];
}

const fabric = createSlice({
  name: 'fabric',
  initialState: INIT_STATE,

  reducers: {
    apiGetAllFabrics(
      state,
      action: {
        type: string;
        payload: {
          paginationPageNumber: number;
          paginationLimit: number;
          searchPhrase: string;
          filterBuilder: FilterItem[];
        };
      }
    ) {},
    apiCreateFabric(state, action: { type: string; payload: string }) {},
    apiUpdateFabric(state, action: { type: string; payload: string }) {},
    apiUpdateFabricVisibility(state, action: { type: string; payload: any }) {},
    apiDeleteFabricById(state, action: { type: string; payload: number }) {},
    changeFabrics(state, action: { type: string; payload: Fabric[] }) {
      state.fabrics = action.payload;
      return state;
    },
    changeTargetFabric(
      state,
      action: { type: string; payload: Fabric | null | undefined }
    ) {
      state.targetFabric = action.payload;
      return state;
    },
    changePaginationInfo(
      state,
      action: { type: string; payload: PaginationInfo }
    ) {
      state.pagination = {
        ...state.pagination,
        paginationInfo: action.payload,
      };
      return state;
    },
  },
});

export const fabricActions = fabric.actions;
export default fabric.reducer;
