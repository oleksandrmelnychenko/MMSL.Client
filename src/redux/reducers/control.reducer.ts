import * as actions from '../actions/control.actions';
import { createReducer } from '@reduxjs/toolkit';

export const defaultControlState = {
  isCollapseMenu: false,
};

export const controlReducer = createReducer(defaultControlState, (builder) =>
  builder.addCase(actions.isCollapseMenu, (state, action) => {
    state.isCollapseMenu = action.payload;
  })
);
