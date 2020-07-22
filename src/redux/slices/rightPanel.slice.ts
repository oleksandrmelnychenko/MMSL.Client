import { createSlice } from '@reduxjs/toolkit';

const _defaultRightPanelProps = () => {
  return {
    title: '',
    width: '600px',
    closeFunctions: null,
    component: null,
  };
};

const INIT_STATE: IRightPanelState = {
  rightPanel: _defaultRightPanelProps(),
};

export interface IRightPanelState {
  rightPanel: RightPanelProps;
}

export interface RightPanelProps {
  title: string;
  width: string;
  closeFunctions: any;
  component: any;

  description?: string;
  commandBarItems?: any[];
  commandBarClassName?: string;
}

const rightPanel = createSlice({
  name: 'rightPanel',
  initialState: INIT_STATE,
  reducers: {
    openRightPanel(state, action: { type: string; payload: RightPanelProps }) {
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
      state.rightPanel = _defaultRightPanelProps();
      return state;
    },
  },
});

export const rightPanelActions = rightPanel.actions;
export default rightPanel.reducer;
