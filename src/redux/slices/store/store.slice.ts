import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IStoreState = {};

export interface IStoreState {}

const store = createSlice({
  name: 'store',
  initialState: INIT_STATE,

  reducers: {
    apiGetAllStores(state) {},
    apiCreateStore(state, action: { type: string; payload: string }) {},
    apiUpdateStore(state, action: { type: string; payload: string }) {},
    apiDeleteStoreById(state, action: { type: string; payload: number }) {},
  },
});

export const storeActions = store.actions;
export default store.reducer;
