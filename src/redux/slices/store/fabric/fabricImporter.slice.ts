import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IFabricImportertate = {
  isImporting: false,
  isExporting: false,
};

export interface IFabricImportertate {
  isImporting: boolean;
  isExporting: boolean;
}

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
      state.isImporting = true;
      return state;
    },
    apiExportToPDFPaginated(state) {
      state.isExporting = true;
      return state;
    },
    apiDownload(state, action: { type: string; payload: string }) {},
    changeIsImporting(state, action: { type: string; payload: boolean }) {
      state.isImporting = action.payload;
      return state;
    },
    changeIsExporting(state, action: { type: string; payload: boolean }) {
      state.isExporting = action.payload;
      return state;
    },
  },
});

export const fabricImporterActions = fabricImporter.actions;
export default fabricImporter.reducer;
