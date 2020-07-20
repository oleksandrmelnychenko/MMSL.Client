import { Fabric } from './../../../../interfaces/fabric';
import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IFabricState = {
  fabrics: [],
};

export interface IFabricState {
  fabrics: Fabric[];
}

const fabric = createSlice({
  name: 'fabric',
  initialState: INIT_STATE,

  reducers: {
    apiGetAllFabrics(state) {},
    apiCreateFabric(state, action: { type: string; payload: string }) {},
    apiUpdateFabric(state, action: { type: string; payload: string }) {},
    apiDeleteFabricById(state, action: { type: string; payload: number }) {},
    changeFabrics(state, action: { type: string; payload: Fabric[] }) {
      state.fabrics = action.payload;
      return state;
    },
  },
});

export const fabricActions = fabric.actions;
export default fabric.reducer;
