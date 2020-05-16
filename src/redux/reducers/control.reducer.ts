import * as actions from '../actions/control.actions';
import { createReducer } from '@reduxjs/toolkit';

export class CommonDialogState {
  constructor() {
    this.isDialogOpen = false;
  }
  isDialogOpen: boolean;
}

export const defaultControlState = {
  isCollapseMenu: false,
  isOpenPanelInfo: false,
  componentInPanelInfo: null,
  commonDialog: new CommonDialogState(),
};

export const controlReducer = createReducer(defaultControlState, (builder) =>
  builder
    .addCase(actions.isCollapseMenu, (state, action) => {
      state.isCollapseMenu = action.payload;
    })
    .addCase(actions.isOpenPanelInfo, (state, action) => {
      state.isOpenPanelInfo = action.payload;
    })
    .addCase(actions.insertComponentToPanelInfo, (state, action) => {
      state.componentInPanelInfo = action.payload;
    })
    .addCase(actions.toggleCommonDialogVisibility, (state, action) => {
      state.commonDialog.isDialogOpen = action.payload;
    })
);
