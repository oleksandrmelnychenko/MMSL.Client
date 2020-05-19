import { createAction } from '@reduxjs/toolkit';
import * as types from '../../constants/control.types.constants';
import { DialogArgs } from '../reducers/control.reducer';

export const isCollapseMenu = createAction<boolean>(types.IS_COLLAPSE_MENU);

export const isOpenPanelInfo = createAction<boolean>(types.IS_OPEN_PANEL_INFO);

export const openInfoPanelWithComponent = createAction<React.FC>(
  types.OPEN_INFO_PANEL_WITH_COMPONENT
);
export const closeInfoPanelWithComponent = createAction(
  types.CLOSE_INFO_PANEL_WITH_COMPONENT
);
export const toggleCommonDialogVisibility = createAction<DialogArgs | null>(
  types.TOGGLE_COMMON_DIALOG_VISIBILITY
);

export const toggleMasterPageBusyIndicator = createAction<boolean>(
  types.TOGGLE_MASTER_PAGE_BUSY_INDICATOR
);

export const showInfoMessage = createAction<string>(types.SHOW_INFO_MESSAGE);

export const enableStatusBar = createAction(types.ENABLE_STATUS_BAR);

export const disabledStatusBar = createAction(types.DISABLE_STATUS_BAR);

export const clearInfoMessage = createAction(types.CLEAR_INFO_MESSAGE);

export type ShowInfoMessage = ReturnType<typeof showInfoMessage>;
export type ToggleMasterPageBusyIndicator = ReturnType<
  typeof toggleMasterPageBusyIndicator
>;
export type ToggleCommonDialogVisibility = ReturnType<
  typeof toggleCommonDialogVisibility
>;
