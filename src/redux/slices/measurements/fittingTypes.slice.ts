import { FittingType } from './../../../interfaces/fittingTypes';
import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IFittingTypesState = {
  fittingTypes: [],
};

export interface IFittingTypesState {
  fittingTypes: FittingType[];
}

const fittingTypes = createSlice({
  name: 'fittingTypes',
  initialState: INIT_STATE,

  reducers: {
    apiGetFittingTypesByMeasurementId(
      state,
      action: { type: string; payload: number }
    ) {
      return state;
    },
    apiGetFittingTypeById(state, action: { type: string; payload: number }) {
      return state;
    },
    apiCreateFittingType(state) {
      return state;
    },
    apiUpdateFittingType(state) {
      return state;
    },
    apiDeleteFittingTypeById(state, action: { type: string; payload: number }) {
      return state;
    },
    changeFittingTypes(
      state,
      action: { type: string; payload: FittingType[] }
    ) {
      state.fittingTypes = action.payload;
      return state;
    },
  },
});

export const fittingTypesActions = fittingTypes.actions;
export default fittingTypes.reducer;
