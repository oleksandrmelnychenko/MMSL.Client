import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IUnitsOfMeasurementState = {};

export interface IUnitsOfMeasurementState {}

const unitsOfMeasurement = createSlice({
  name: 'unitsOfMeasurement',
  initialState: INIT_STATE,

  reducers: {
    apiGetAllUnitsOfMeasurement(state) {
      return state;
    },
  },
});

export const unitsOfMeasurementActions = unitsOfMeasurement.actions;
export default unitsOfMeasurement.reducer;
