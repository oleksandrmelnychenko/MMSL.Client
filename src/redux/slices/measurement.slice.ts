import { Measurement, MeasurementMapSize } from './../../interfaces/index';
import { createSlice } from '@reduxjs/toolkit';

export class MeasurementsState {
  constructor() {
    this.isMeasurementsWasRequested = false;
    this.measurementList = [];
    this.targetMeasurement = null;
    this.managingMeasurementPanelContent = null;
    this.selectedSize = null;
    this.managingSizeChartState = {
      targetSizeChart: null,
    };
  }

  managingMeasurementPanelContent: ManagingMeasurementPanelComponent | null;
  isMeasurementsWasRequested: boolean;
  measurementList: Measurement[];
  targetMeasurement: Measurement | null | undefined;
  selectedSize: MeasurementMapSize | null | undefined;

  managingSizeChartState: {
    targetSizeChart: MeasurementMapSize | null | undefined;
  };
}

export enum ManagingMeasurementPanelComponent {
  CreateNewMeasurement,
  EditMeasurement,
  AddChartSize,
  EditChartSize,
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
    apiUpdateMeasurementSize(state, action) {
      return state;
    },
    apiDeleteMeasurementSizeById(
      state,
      action: {
        type: string;
        payload: { measurementId: number; sizeId: number };
      }
    ) {
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
    changeSelectedSize(
      state,
      action: { type: string; payload: MeasurementMapSize | null | undefined }
    ) {
      state.selectedSize = action.payload;

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
    changeSizeForEdit(
      state,
      action: { type: string; payload: MeasurementMapSize | null | undefined }
    ) {
      state.managingSizeChartState.targetSizeChart = action.payload;

      return state;
    },
  },
});

export const measurementActions = measurements.actions;
export default measurements.reducer;
