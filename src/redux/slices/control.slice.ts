import { createSlice } from '@reduxjs/toolkit';
import { IPanelInfo } from '../../interfaces';

export interface IControlState {
  isGlobalShimmerActive: boolean;
  isCollapseMenu: boolean;
  panelInfo: IPanelInfo;
  rightPanel: RightPanelProps;
  commonDialog: CommonDialogState;
  infoMessage: string;
  isActivateStatusBar: boolean;
  isMasterBusy: boolean;
  dashboardHintStub: DashboardHintStubProps;
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

export const defaultControlState = {
  isGlobalShimmerActive: false,
  isCollapseMenu: false,
  panelInfo: new IPanelInfo(),
  rightPanel: new RightPanelProps(),
  commonDialog: new CommonDialogState(),
  infoMessage: '',
  isActivateStatusBar: false,
  isMasterBusy: false,
  dashboardHintStub: new DashboardHintStubProps(),
};

const controls = createSlice({
  name: 'control',
  initialState: defaultControlState,
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
    showInfoMessage(state, action) {
      state.isActivateStatusBar = false;
      state.infoMessage = action.payload;
      return state;
    },
    clearInfoMessage(state) {
      state.infoMessage = '';
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
  },
});

export const controlActions = controls.actions;
export default controls.reducer;
