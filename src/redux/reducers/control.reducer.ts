import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/control.actions';

export class CommonDialogState {
  constructor() {
    this.dialogArgs = null;
  }
  dialogArgs: DialogArgs | null;
}

export class DialogArgs {
  constructor(
    dialogType: CommonDialogType,
    title: string,
    subText: string,
    onSubmitClick: () => void,
    onDeclineClick: () => void
  ) {
    this.dialogType = dialogType;
    this.title = title;
    this.subText = subText;
    this.onSubmitClick = onSubmitClick;
    this.onDeclineClick = onDeclineClick;
  }

  dialogType: CommonDialogType;
  title: string;
  subText: string;
  onSubmitClick: () => void;
  onDeclineClick: () => void;
}

export enum CommonDialogType {
  Common,
  Delete,
}

export class PanelInfo {
  constructor() {
    this.isOpenPanelInfo = false;
    this.componentInPanelInfo = null;
  }
  isOpenPanelInfo: boolean;
  componentInPanelInfo: React.FC | null;
}

export const defaultControlState = {
  isGlobalShimmerActive: false,
  isCollapseMenu: false,
  panelInfo: new PanelInfo(),
  commonDialog: new CommonDialogState(),
  infoMessage: '',
  isActivateStatusBar: false,
  isMasterBusy: false,
};

export const controlReducer = createReducer(defaultControlState, (builder) =>
  builder
    .addCase(actions.isOpenPanelInfo, (state, action) => {
      state.panelInfo.isOpenPanelInfo = action.payload;
    })
    .addCase(actions.openInfoPanelWithComponent, (state, action) => {
      state.isCollapseMenu = true;
      state.panelInfo.isOpenPanelInfo = true;
      state.panelInfo.componentInPanelInfo = action.payload;
    })
    .addCase(actions.closeInfoPanelWithComponent, (state) => {
      state.isCollapseMenu = false;
      state.panelInfo.isOpenPanelInfo = false;
      state.panelInfo.componentInPanelInfo = null;
    })
    .addCase(actions.toggleCommonDialogVisibility, (state, action) => {
      state.commonDialog.dialogArgs = action.payload;
    })
    .addCase(actions.showInfoMessage, (state, action) => {
      state.isActivateStatusBar = false;
      state.infoMessage = action.payload;
    })
    .addCase(actions.clearInfoMessage, (state) => {
      state.infoMessage = '';
    })
    .addCase(actions.enableStatusBar, (state) => {
      state.isActivateStatusBar = true;
    })
    .addCase(actions.disabledStatusBar, (state) => {
      state.isActivateStatusBar = false;
    })
    .addCase(actions.showGlobalShimmer, (state) => {
      state.isGlobalShimmerActive = true;
    })
    .addCase(actions.hideGlobalShimmer, (state) => {
      state.isGlobalShimmerActive = false;
    })
);
