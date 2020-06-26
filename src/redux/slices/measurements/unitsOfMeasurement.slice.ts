import { createSlice } from '@reduxjs/toolkit';
import { MeasurementUnit } from '../../../interfaces/measurements';

const INIT_STATE: IUnitsOfMeasurementState = {
  unitsOfMeasurement: [],
};

export interface IUnitsOfMeasurementState {
  unitsOfMeasurement: MeasurementUnit[];
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
      state.unitsOfMeasurement = action.payload;

      return state;
    },
  },
});

export const unitsOfMeasurementActions = unitsOfMeasurement.actions;
export default unitsOfMeasurement.reducer;
