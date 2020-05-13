import { createAction } from '@reduxjs/toolkit';
import * as types from '../../constants/control.types.constants';

export const isCollapseMenu = createAction<boolean>(types.IS_COLLAPSE_MENU);

export const isOpenPanelInfo = createAction<boolean>(types.IS_OPEN_PANEL_INFO);
