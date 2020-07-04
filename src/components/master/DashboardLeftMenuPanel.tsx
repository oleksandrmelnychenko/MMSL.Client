import React from 'react';
import './dashboard.scss';
import { useLocation, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { controlActions } from '../../redux/slices/control.slice';
import { stylesPanelInfo } from '../../common/fabric-styles/styles';
import { IPanelInfo } from '../../interfaces/index';

const DashboardLeftMenuPanel: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const panelInfo: IPanelInfo = useSelector<IApplicationState, IPanelInfo>(
    (state) => state.control.panelInfo
  );

  const dismissPanelInfo = () => {
    if (panelInfo.onDismisPendingAction) {
      panelInfo.onDismisPendingAction();
    }

    dispatch(controlActions.closeInfoPanelWithComponent());
  };

  return (
    <>
      <Panel
        type={PanelType.smallFixedNear}
        isBlocking={false}
        hasCloseButton={panelInfo.hasCloseButton}
        styles={stylesPanelInfo}
        isOpen={panelInfo.isOpenPanelInfo}
        onDismiss={(args: any) => {
          console.log(args);

          if (args && args?.key === 'Escape') {
          } else {
            dismissPanelInfo();
          }
        }}
      >
        <Route
          path={location.pathname}
          component={panelInfo.componentInPanelInfo}
        />
      </Panel>
    </>
  );
};

export default DashboardLeftMenuPanel;
