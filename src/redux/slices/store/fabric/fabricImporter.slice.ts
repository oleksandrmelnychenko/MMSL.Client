import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IFabricImportertate = {};

export interface IFabricImportertate {}

const fabricImporter = createSlice({
  name: 'fabricImporter',
  initialState: INIT_STATE,

  reducers: {
    apiImportFabricsFromExcel(
      state,
      action: {
        type: string;
        payload: any;
      }
    ) {
      debugger;
    },
  },
});

export const fabricImporterActions = fabricImporter.actions;
export default fabricImporter.reducer;
