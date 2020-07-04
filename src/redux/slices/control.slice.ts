import { createSlice } from '@reduxjs/toolkit';
import { IPanelInfo } from '../../interfaces';
import { RoleType } from '../../interfaces/identity';

export class ControlState {
  constructor() {
    this.isGlobalShimmerActive = false;
    this.isCollapseMenu = false;
    this.panelInfo = new IPanelInfo();
    this.rightPanel = new RightPanelProps();
    this.commonDialog = new CommonDialogState();
    this.infoMessage = null;
    this.isActivateStatusBar = false;
    this.isMasterBusy = false;
    this.dashboardHintStub = new DashboardHintStubProps();
    this.contentClassName = '';
  }

  isGlobalShimmerActive: boolean;
  isCollapseMenu: boolean;
  panelInfo: IPanelInfo;
  rightPanel: RightPanelProps;
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

export class RightPanelProps {
  constructor() {
    this.title = '';
    this.width = '600px';
    this.closeFunctions = null;
    this.component = null;
  }
  title: string;
  description?: string;
  width: string;
  commandBarItems?: any[];
  commandBarClassName?: string;
  closeFunctions: any;
  component: any;
}

export class DashboardHintStubProps {
  constructor() {
    this.isVisible = false;
    this.title = '';
    this.buttonLabel = '';
    this.buttonAction = () => {};
  }
  isVisible: boolean;
  title: string;
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
    isOpenPanelInfo(state, action) {
      state.panelInfo.isOpenPanelInfo = action.payload;
      return state;
    },
    isCollapseMenu(state, action) {
      state.panelInfo.isOpenPanelInfo = action.payload;
      return state;
    },
    openInfoPanelWithComponent(
      state,
      action: {
        type: string;
        payload: {
          component: any;
          onDismisPendingAction: () => void;
        };
      }
    ) {
      state.isCollapseMenu = true;
      state.panelInfo.isOpenPanelInfo = true;
      state.panelInfo.componentInPanelInfo = action.payload.component;
      state.panelInfo.onDismisPendingAction =
        action.payload.onDismisPendingAction;
      return state;
    },
    closeInfoPanelWithComponent(state) {
      state.isCollapseMenu = false;
      state.panelInfo = new IPanelInfo();
      return state;
    },
    toggleCommonDialogVisibility(state, action) {
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
    openRightPanel(state, action) {
      state.rightPanel = {
        ...state.rightPanel,
        title: action.payload.title,
        width: action.payload.width,
        commandBarClassName: action.payload.commandBarClassName,
        description: action.payload.description,
        commandBarItems: [],
        closeFunctions: action.payload.closeFunctions,
        component: action.payload.component,
      };
      return state;
    },
    setPanelButtons(state, action) {
      state.rightPanel.commandBarItems = action.payload;
      return state;
    },
    closeRightPanel(state) {
      state.rightPanel = new RightPanelProps();
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
