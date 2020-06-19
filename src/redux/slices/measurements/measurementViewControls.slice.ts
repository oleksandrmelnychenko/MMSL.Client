import { createSlice } from '@reduxjs/toolkit';

export enum ChartDisplayToMeasurementType {
  Base,
  Body,
}

const INIT_STATE: IMeasurementViewControlsState = {
  chartDisplay: ChartDisplayToMeasurementType.Base,
};

export interface IMeasurementViewControlsState {
  chartDisplay: ChartDisplayToMeasurementType;
}

const measurementViewControls = createSlice({
  name: 'measurementViewControls',
  initialState: INIT_STATE,

  reducers: {
    changeChartDisplay(
      state,
      action: { type: string; payload: ChartDisplayToMeasurementType }
    ) {
      state.chartDisplay = action.payload;

      return state;
    },
  },
});

export const measurementViewControlsActions = measurementViewControls.actions;
export default measurementViewControls.reducer;
