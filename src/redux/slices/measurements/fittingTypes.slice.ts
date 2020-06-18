import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IFittingTypesState = {};

export interface IFittingTypesState {}

const fittingTypes = createSlice({
  name: 'fittingTypes',
  initialState: INIT_STATE,

  reducers: {
    apiGetFittingTypesByMeasurementId(state) {
      return state;
    },
  },
});

export const fittingTypesActions = fittingTypes.actions;
export default fittingTypes.reducer;
