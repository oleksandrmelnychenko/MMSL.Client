import { Measurement } from './../../interfaces/index';
import { createSlice } from '@reduxjs/toolkit';

export class MeasurementsState {
  constructor() {
    this.isMeasurementsWasRequested = false;
    this.measurementList = [];
    this.targetMeasurement = null;
    this.managingMeasurementPanelContent = null;
  }

  managingMeasurementPanelContent: ManagingMeasurementPanelComponent | null;
  isMeasurementsWasRequested: boolean;
  measurementList: Measurement[];
  targetMeasurement: Measurement | null | undefined;
}

export enum ManagingMeasurementPanelComponent {
  CreateNewMeasurement,
  EditMeasurement,
  AddChartSize,
}

const measurements = createSlice({
  name: 'measurements',
  initialState: new MeasurementsState(),

  reducers: {
    apiGetAllMeasurements(state) {
      return state;
    },
    apiCreateNewMeasurement(state, action) {
      return state;
    },
    apiUpdateMeasurement(state, action) {
      return state;
    },
    apiGetMeasurementById(state, action: { type: string; payload: number }) {
      return state;
    },
    apiDeleteMeasurementById(state, action: { type: string; payload: number }) {
      return state;
    },
    apiCreateNewMeasurementSize(state, action) {
      return state;
    },
    updateisMeasurementsWasRequested(
      state,
      action: { type: string; payload: boolean }
    ) {
      state.isMeasurementsWasRequested = action.payload;

      return state;
    },
    updateMeasurementsList(
      state,
      action: { type: string; payload: Measurement[] }
    ) {
      state.measurementList = action.payload;

      return state;
    },
    changeSelectedMeasurement(
      state,
      action: { type: string; payload: Measurement | null | undefined }
    ) {
      state.targetMeasurement = action.payload;

      return state;
    },
    changeManagingMeasurementPanelContent(
      state,
      action: {
        type: string;
        payload: ManagingMeasurementPanelComponent | null;
      }
    ) {
      state.managingMeasurementPanelContent = action.payload;

      return state;
    },
  },
});

export const measurementActions = measurements.actions;
export default measurements.reducer;
