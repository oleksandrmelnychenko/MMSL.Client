import { createSlice } from '@reduxjs/toolkit';
import { CurrencyF, PaymentTypeF } from '../../interfaces';

export class MeasurementsState {
  constructor() {}
}

const units = createSlice({
  name: 'measurements',
  initialState: new MeasurementsState(),
  reducers: {
    getAllMeasurements(state, action) {
      return state;
    },
  },
});

export const unitsActions = units.actions;
export default units.reducer;
