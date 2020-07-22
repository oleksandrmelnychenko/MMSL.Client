import React from 'react';
import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import { useLocation, Route } from 'react-router-dom';
import CommonDialog from './DashboardDialog/CommonDialog';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import {
  RightPanelProps,
  DashboardHintStubProps,
} from '../../redux/slices/control.slice';
import { panelStyle } from '../../common/fabric-styles/styles';
import { RightPanel } from './panel/RightPanel';
import DashboardLeftMenuPanel from './DashboardLeftMenuPanel';
import HintStub from './dashboardHint/HintStub';
import IdentityDashboardRoute from './IdentityDashboardRoute';

const Dashboard: React.FC = () => {
  const location = useLocation();

  const isCollapseMenu = useSelector<IApplicationState, boolean>(
    (state) => state.control.isCollapseMenu
  );

  const rightPanel = useSelector<IApplicationState, RightPanelProps>(
    (state) => state.control.rightPanel
  );

  const dashboardStubHint = useSelector<
    IApplicationState,
    DashboardHintStubProps
  >((state) => state.control.dashboardHintStub);

  const contentClassName = useSelector<IApplicationState, string>(
    (state) => state.control.contentClassName
  );

  return (
    <>
      <Header />
      <main className={isCollapseMenu ? 'collapse' : ''}>
        <Menu />

        <DashboardLeftMenuPanel />

        <div className={`content ${contentClassName}`}>
          <div
            style={
              dashboardStubHint?.isVisible
                ? {
                    position: 'absolute',
                    top: '-1000000000px',
                    left: '-1000000000px',
                    zIndex: 0,
                  }
                : {}
            }
          >
            <IdentityDashboardRoute />
          </div>

          <div
            style={
              dashboardStubHint?.isVisible
                ? {}
                : {
                    position: 'absolute',
                    top: '-1000000000px',
                    left: '-1000000000px',
                    zIndex: 0,
                  }
            }
          >
            <HintStub />
          </div>
        </div>
      </main>

      <Footer />
      {!!rightPanel.title && (
        <Panel
          type={PanelType.custom}
          customWidth={rightPanel.width}
          isBlocking={true}
          styles={{ ...panelStyle, root: { zIndex: 10 } }}
          isOpen={!!rightPanel.title}
          onDismiss={(args: any) => {
            if (args) {
              rightPanel.closeFunctions();
            }
          }}
        >
          <Route path={location.pathname} component={RightPanel} />
        </Panel>
      )}

      <CommonDialog />
    </>
  );
};

export default Dashboard;
