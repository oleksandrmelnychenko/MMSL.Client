import { createAction } from '@reduxjs/toolkit';
import * as types from '../../constants/control.types.constants';

export const isCollapseMenu = createAction<boolean>(types.IS_COLLAPSE_MENU);

export const isOpenPanelInfo = createAction<boolean>(types.IS_OPEN_PANEL_INFO);

export const insertComponentToPanelInfo = createAction<any>(
  types.INSERT_COMPONENT_PANEL_INFO
);
export const toggleCommonDialogVisibility = createAction<boolean>(
  types.TOGGLE_COMMON_DIALOG_VISIBILITY
);

export type ToggleCommonDialogVisibility = ReturnType<
  typeof toggleCommonDialogVisibility
>;
