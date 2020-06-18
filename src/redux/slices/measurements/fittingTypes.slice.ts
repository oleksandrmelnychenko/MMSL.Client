import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IFittingTypesState = {};

export interface IFittingTypesState {}

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
  },
});

export const fittingTypesActions = fittingTypes.actions;
export default fittingTypes.reducer;
