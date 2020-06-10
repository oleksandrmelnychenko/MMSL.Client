import React from 'react';
import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import { Switch, useLocation, Route } from 'react-router-dom';
import Dealers from '../dealers/Dealers';
import Customers from '../customers/Customers';
import CommonDialog from './CommonDialog';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import {
  RightPanelProps,
  DashboardHintStubProps,
} from '../../redux/slices/control.slice';
import { panelStyle } from '../../common/fabric-styles/styles';
import Reports from '../reports/Reports';
import ProductCategoryView from '../product-category/ProductCategoryView';
import { RightPanel } from './panel/RightPanel';
import DashboardLeftMenuPanel from './DashboardLeftMenuPanel';
import HintStub from './dashboardHint/HintStub';

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

  return (
    <>
      <Header />
      <main className={isCollapseMenu ? 'collapse' : ''}>
        <Menu />

        <DashboardLeftMenuPanel />

        <div className="content">
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
            <Switch>
              <Route path={`/en/app/dealers`} component={Dealers} />
              <Route path={`/en/app/customer`} component={Customers} />
              <Route path={`/en/app/product`} component={ProductCategoryView} />
              {/* Old pages not neccessary now */}
              {/* <Route path={`/en/app/timeline`} component={Timeline} /> */}
              {/* Old pages not neccessary now */}
              {/* <Route path={`/en/app/styles`} component={ProductSettings} /> */}
              <Route path={`/en/app/reports`} component={Reports} />
            </Switch>
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
