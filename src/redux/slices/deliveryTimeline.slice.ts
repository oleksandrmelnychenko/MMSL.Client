import { createSlice } from '@reduxjs/toolkit';
import { DeliveryTimeline } from '../../interfaces/deliveryTimelines';
import { List } from 'linq-typescript';

export class DeliveryTimelinesState {
  constructor() {
    this.deliveryTimelines = [];
    this.selectedDeliveryTimeline = null;
  }
  deliveryTimelines: DeliveryTimeline[];
  selectedDeliveryTimeline: DeliveryTimeline | null;
}

const deliveryTimelines = createSlice({
  name: 'deliveryTimelines',
  initialState: new DeliveryTimelinesState(),
  reducers: {
    apiGetAllDeliveryTimeline(state) {
      return state;
    },
    apiCreateNewDeliveryTimeline(
      state,
      action: { type: string; payload: DeliveryTimeline }
    ) {
      return state;
    },
    apiUpdateDeliveryTimeline(
      state,
      action: { type: string; payload: DeliveryTimeline }
    ) {
      return state;
    },
    apiDeleteDeliveryTimeline(
      state,
      action: { type: string; payload: number }
    ) {
      return state;
    },
    successGetAllDeliveryTimelines(
      state,
      action: { type: string; payload: DeliveryTimeline[] }
    ) {
      state.deliveryTimelines = action.payload;
      return state;
    },
    clearAllDeliveryTimelines(state) {
      state.deliveryTimelines = [];
      return state;
    },
    selectedDeliveryTimeLine(state, action: { type: string; payload: number }) {
      state.selectedDeliveryTimeline = new List<DeliveryTimeline>(
        state.deliveryTimelines
      ).first((timeline) => timeline.id === action.payload);
      return state;
    },
    clearSelectedDeliveryTimeLine(state) {
      state.selectedDeliveryTimeline = null;
      return state;
    },
    resetWholeState(state) {
      state = new DeliveryTimelinesState();

      return state;
    },
  },
});

export const deliveryTimelinesActions = deliveryTimelines.actions;
export default deliveryTimelines.reducer;
