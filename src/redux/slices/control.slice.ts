import { createSlice } from '@reduxjs/toolkit';
import { RoleType } from '../../interfaces/identity';

export class ControlState {
  constructor() {
    this.isGlobalShimmerActive = false;
    this.commonDialog = new CommonDialogState();
    this.infoMessage = null;
    this.isActivateStatusBar = false;
    this.isMasterBusy = false;
    this.dashboardHintStub = new DashboardHintStubProps();
    this.contentClassName = '';
  }

  isGlobalShimmerActive: boolean;
  commonDialog: CommonDialogState;
  infoMessage: InfoMessage | null | undefined;
  isActivateStatusBar: boolean;
  isMasterBusy: boolean;
  dashboardHintStub: DashboardHintStubProps;
  contentClassName: string;
}

export class CommonDialogState {
  constructor() {
    this.dialogArgs = null;
  }
  dialogArgs: IDialogArgs | null;
}

export interface IDialogArgs {
  dialogType: CommonDialogType;
  title: string;
  subText: string;
  viewContent?: any;
  onSubmitClick: () => void;
  onDeclineClick: () => void;
}

export class ModalArgs {}

export enum CommonDialogType {
  Common,
  Delete,
  Content,
}

export class DashboardHintStubProps {
  constructor() {
    this.isVisible = false;
    this.title = '';
    this.isButtonAvailable = false;
    this.buttonLabel = '';
    this.buttonAction = () => {};
  }

  isVisible: boolean;
  title: string;
  isButtonAvailable: boolean;
  buttonLabel: string;
  buttonAction: () => void;
}

export enum InfoMessageType {
  Common,
  Warning,
}

export class InfoMessage {
  constructor(message: string, messageType?: InfoMessageType) {
    this.message = message;

    if (messageType) this.messageType = messageType;
    else this.messageType = InfoMessageType.Common;
  }

  message: string;
  messageType: InfoMessageType;
}

export interface IInfoPanelMenuItem {
  title: string;
  className: string;
  onClickFunc: Function;
  isDisabled: boolean;
  tooltip: string;
  allowedRoles: RoleType[];
}

const controls = createSlice({
  name: 'control',
  initialState: new ControlState(),
  reducers: {
    toggleCommonDialogVisibility(
      state,
      action: { type: string; payload: IDialogArgs | null }
    ) {
      state.commonDialog.dialogArgs = action.payload;
      return state;
    },
    showInfoMessage(state, action: { type: string; payload: InfoMessage }) {
      state.isActivateStatusBar = false;
      state.infoMessage = action.payload;
      return state;
    },
    clearInfoMessage(state) {
      state.infoMessage = null;
      return state;
    },
    enableStatusBar(state) {
      state.isActivateStatusBar = true;
      return state;
    },
    disabledStatusBar(state) {
      state.isActivateStatusBar = false;
      return state;
    },
    showGlobalShimmer(state) {
      state.isGlobalShimmerActive = true;
      return state;
    },
    hideGlobalShimmer(state) {
      state.isGlobalShimmerActive = false;
      return state;
    },
    showDashboardHintStub(
      state,
      action: {
        type: string;
        payload: DashboardHintStubProps;
      }
    ) {
      state.dashboardHintStub = {
        ...state.dashboardHintStub,
        isVisible: action.payload.isVisible,
        title: action.payload.title,
        isButtonAvailable: action.payload.isButtonAvailable,
        buttonLabel: action.payload.buttonLabel,
        buttonAction: action.payload.buttonAction,
      };
      return state;
    },
    closeDashboardHintStub(state) {
      state.dashboardHintStub = new DashboardHintStubProps();

      return state;
    },
    changeContentClassName(state, action) {
      state.contentClassName = action.payload;

      return state;
    },
    resetWholeState(state) {
      state = new ControlState();

      return state;
    },
  },
});

export const controlActions = controls.actions;
export default controls.reducer;
