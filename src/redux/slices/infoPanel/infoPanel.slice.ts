import { createSlice } from '@reduxjs/toolkit';

const INIT_STATE: IInfoPanelState = {
  isOpenPanelInfo: false,
  hasCloseButton: false,
  isHasCloseButton: true,
  isCollapseMenu: false,

  componentInPanelInfo: null,

  onDismisPendingAction: () => {},
};

export interface IInfoPanelState {
  isOpenPanelInfo: boolean;
  hasCloseButton: boolean;
  isHasCloseButton: boolean;
  isCollapseMenu: boolean;

  componentInPanelInfo: any;

  onDismisPendingAction: () => void;
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
  },
});

export const infoPanelActions = infoPanel.actions;
export default infoPanel.reducer;
