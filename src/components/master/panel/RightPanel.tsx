import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import {
  RightPanelProps,
  controlActions,
} from '../../../redux/slices/control.slice';
import {
  Stack,
  Text,
  CommandBar,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import { commandBarStyles } from '../../../common/fabric-styles/styles';

export const RightPanel: React.FC<RightPanelProps> = () => {
  const dispatch = useDispatch();

  const rightPanel = useSelector<IApplicationState, RightPanelProps>(
    (state) => state.control.rightPanel
  );

  useEffect(() => {
    document.onkeydown = (event) => {
      if ((event as any).keyCode === 27) {
        event.preventDefault();
        dispatch(controlActions.closeRightPanel());
      }
    };
    return () => {
      document.onkeydown = null;
    };
  });

  return (
    <div>
      <div className="panelTitle">
        <Stack
          tokens={{ childrenGap: 20 }}
          horizontal
          className="panelTitle__panelHeader"
        >
          <Text className="panelTitle__title">{rightPanel.title}</Text>
          <Text className="panelTitle__description">
            {rightPanel.description}
          </Text>
        </Stack>
      </div>
      <div>
        <CommandBar
          styles={commandBarStyles}
          items={rightPanel.commandBarItems as ICommandBarItemProps[]}
          className={rightPanel.commandBarClassName}
        />
      </div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack grow={1}>
          <rightPanel.component />
        </Stack>
      </Stack>
    </div>
  );
};
