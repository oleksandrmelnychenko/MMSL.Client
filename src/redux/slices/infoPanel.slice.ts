import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IInfoPanelState = {
  isOpenPanelInfo: false,
  hasCloseButton: false,
  isHasCloseButton: true,
  isCollapseMenu: false,

  componentInPanelInfo: null,

  commands: [],

  onDismisPendingAction: () => {},
};

export interface IInfoPanelState {
  isOpenPanelInfo: boolean;
  hasCloseButton: boolean;
  isHasCloseButton: boolean;
  isCollapseMenu: boolean;

  componentInPanelInfo: any;

  commands: ICommand[];

  onDismisPendingAction: () => void;
}

export interface ICommand {
  name: string;
  isDisabled: boolean;
  className: string;
  onClick: () => void;
}

const infoPanel = createSlice({
  name: 'infoPanel',
  initialState: INIT_STATE,
  reducers: {
    isOpenPanelInfo(state, action) {
      state.isOpenPanelInfo = action.payload;
      return state;
    },
    isCollapseMenu(state, action) {
      state.isOpenPanelInfo = action.payload;
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
      state.isOpenPanelInfo = true;
      state.componentInPanelInfo = action.payload.component;
      state.onDismisPendingAction = action.payload.onDismisPendingAction;
      return state;
    },
    closeInfoPanelWithComponent(state) {
      state.isCollapseMenu = false;

      state.isOpenPanelInfo = false;
      state.hasCloseButton = false;
      state.isHasCloseButton = true;

      state.onDismisPendingAction = () => {};

      return state;
    },
    updateCommands(state, action: { type: string; payload: ICommand[] }) {
      state.commands = action.payload;
      return state;
    },
  },
});

export const infoPanelActions = infoPanel.actions;
export default infoPanel.reducer;
