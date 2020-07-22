import { createSlice } from '@reduxjs/toolkit';

export enum RightPanelType {
  Form,
  ReadOnly,
}

export interface IRightPanelState {
  rightPanel: IRightPanelProps;
}

export interface IRightPanelProps {
  title: string;
  width: string;
  closeFunctions: any;
  component: any;
  panelType: RightPanelType;

  description?: string;
  commandBarItems?: any[];
  commandBarClassName?: string;
}

const _defaultRightPanelProps = () => {
  return {
    title: '',
    width: '600px',
    closeFunctions: null,
    component: null,
    panelType: RightPanelType.Form,
  };
};

const INIT_STATE: IRightPanelState = {
  rightPanel: _defaultRightPanelProps(),
};

const rightPanel = createSlice({
  name: 'rightPanel',
  initialState: INIT_STATE,
  reducers: {
    openRightPanel(state, action: { type: string; payload: IRightPanelProps }) {
      state.rightPanel = {
        ...state.rightPanel,
        title: action.payload.title,
        width: action.payload.width,
        commandBarClassName: action.payload.commandBarClassName,
        description: action.payload.description,
        commandBarItems: [],
        closeFunctions: action.payload.closeFunctions,
        component: action.payload.component,
        panelType: action.payload.panelType,
      };
      return state;
    },
    setPanelButtons(state, action) {
      state.rightPanel.commandBarItems = action.payload;
      return state;
    },
    closeRightPanel(state) {
      state.rightPanel = _defaultRightPanelProps();
      return state;
    },
  },
});

export const rightPanelActions = rightPanel.actions;
export default rightPanel.reducer;
