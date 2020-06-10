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
  ScrollablePane,
  Sticky,
  StickyPositionType,
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
      <Sticky stickyPosition={StickyPositionType.Header}>
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
      </Sticky>

      <ScrollablePane styles={{ root: { top: '188px', marginBottom: '28px' } }}>
        <div style={{ padding: '28px 28px 0px 28px' }}>
          <rightPanel.component />
        </div>
      </ScrollablePane>
    </div>
  );
};
