import { MeasurementUnit } from './../../../interfaces/fittingTypes';
import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IUnitsOfMeasurementState = {
  uintsOfMeasurement: [],
};

export interface IUnitsOfMeasurementState {
  uintsOfMeasurement: MeasurementUnit[];
}

const unitsOfMeasurement = createSlice({
  name: 'unitsOfMeasurement',
  initialState: INIT_STATE,

  reducers: {
    apiGetAllUnitsOfMeasurement(state) {
      return state;
    },
    changeUnitsOfMeasurement(
      state,
      action: { type: string; payload: MeasurementUnit[] }
    ) {
      state.uintsOfMeasurement = action.payload;

      return state;
    },
  },
});

export const unitsOfMeasurementActions = unitsOfMeasurement.actions;
export default unitsOfMeasurement.reducer;
