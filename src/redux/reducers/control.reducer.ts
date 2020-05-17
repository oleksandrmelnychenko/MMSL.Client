import * as actions from '../actions/control.actions';
import { createReducer } from '@reduxjs/toolkit';

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

export const defaultControlState = {
  isCollapseMenu: false,
  isOpenPanelInfo: false,
  componentInPanelInfo: null,
  commonDialog: new CommonDialogState(),
  infoMessage: '',
  isActivateStatusBar: false,
  isMasterBusy: false,
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
      state.commonDialog.dialogArgs = action.payload;
    })
    .addCase(actions.toggleMasterPageBusyIndicator, (state, action) => {
      state.isMasterBusy = action.payload;
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
);
