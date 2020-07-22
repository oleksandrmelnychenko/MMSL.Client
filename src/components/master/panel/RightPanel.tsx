import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import {
  IRightPanelProps,
  rightPanelActions,
  RightPanelType,
} from '../../../redux/slices/rightPanel.slice';
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

const _renderCommandsBar = (rightPanelProps: IRightPanelProps) => {
  let result: any = null;

  if (rightPanelProps.panelType === RightPanelType.Form) {
    result = (
      <div className="rightPanel__commandBar">
        <CommandBar
          styles={commandBarStyles}
          items={rightPanelProps.commandBarItems as ICommandBarItemProps[]}
          className={rightPanelProps.commandBarClassName}
        />
      </div>
    );
  }

  return result;
};

const _resolvePanelContentStyle = (panelType: RightPanelType) => {
  let result: any = null;

  if (panelType === RightPanelType.Form) {
    result = { root: { top: '188px', marginBottom: '28px' } };
  } else if (panelType === RightPanelType.ReadOnly) {
    result = { root: { top: '74px', marginBottom: '28px' } };
  }

  return result;
};

export const RightPanel: React.FC<IRightPanelProps> = () => {
  const dispatch = useDispatch();

  const rightPanelProps: IRightPanelProps = useSelector<
    IApplicationState,
    IRightPanelProps
  >((state) => state.rightPanel.rightPanel);

  useEffect(() => {
    document.onkeydown = (event) => {
      if ((event as any).keyCode === 27) {
        event.preventDefault();
        dispatch(rightPanelActions.closeRightPanel());
      }
    };
    return () => {
      document.onkeydown = null;
    };
  });

  return (
    <div className="rightPanel">
      <Sticky stickyPosition={StickyPositionType.Header}>
        <div className="panelTitle">
          <Stack
            tokens={{ childrenGap: 20 }}
            horizontal
            className="panelTitle__panelHeader"
          >
            <Text className="panelTitle__title">{rightPanelProps.title}</Text>
            <Text className="panelTitle__description">
              {rightPanelProps.description}
            </Text>
          </Stack>
        </div>
        {_renderCommandsBar(rightPanelProps)}
      </Sticky>

      <ScrollablePane
        styles={_resolvePanelContentStyle(rightPanelProps.panelType)}
      >
        <div style={{ padding: '28px 28px 0px 28px' }}>
          <rightPanelProps.component />
        </div>
      </ScrollablePane>
    </div>
  );
};
