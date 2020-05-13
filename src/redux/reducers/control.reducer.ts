import * as actions from '../actions/control.actions';
import { createReducer } from '@reduxjs/toolkit';

export const defaultControlState = {
  isCollapseMenu: false,
  isOpenPanelInfo: false,
  componentInPanelInfo: null,
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
);
