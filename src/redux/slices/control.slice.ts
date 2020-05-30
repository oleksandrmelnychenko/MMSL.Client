import { createSlice } from '@reduxjs/toolkit';
import { ICommandBarItemProps } from 'office-ui-fabric-react';
import { IControlState } from '../../interfaces';

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
  rightPanel: new RightPanelProps(),
  commonDialog: new CommonDialogState(),
  infoMessage: '',
  isActivateStatusBar: false,
  isMasterBusy: false,
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
    openInfoPanelWithComponent(state, action) {
      state.isCollapseMenu = true;
      state.panelInfo.isOpenPanelInfo = true;
      state.panelInfo.componentInPanelInfo = action.payload;
      return state;
    },
    closeInfoPanelWithComponent(state) {
      state.isCollapseMenu = false;
      state.panelInfo.isOpenPanelInfo = false;
      state.panelInfo.componentInPanelInfo = null;
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
      return Object.assign(state, {
        rightPanel: Object.assign({}, state.rightPanel, {
          title: action.payload.title,
          width: action.payload.width,
          commandBarClassName: action.payload.commandBarClassName,
          description: action.payload.description,
          commandBarItems: [],
          closeFunctions: action.payload.closeFunctions,
          component: action.payload.component,
        } as any),
      } as IControlState);
    },
    setPanelButtons(state, action) {
      return Object.assign(state, {
        rightPanel: Object.assign({}, state.rightPanel, {
          commandBarItems: action.payload,
        } as any),
      } as IControlState);
    },
    closeRightPanel(state) {
      return Object.assign(state, {
        rightPanel: new RightPanelProps(),
      } as IControlState);
    },
  },
});

export const controlActions = controls.actions;
export default controls.reducer;
