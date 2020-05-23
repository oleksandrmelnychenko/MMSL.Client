import React from 'react';
import * as dealerActions from '../../redux/actions/dealer.actions';
import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import { Switch, useLocation } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Dealers from '../dealers/Dealers';
import Customers from '../customers/Customers';
import CommonDialog from './CommonDialog';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as controlAction from '../../redux/actions/control.actions';

import { stylesPanelInfo } from '../../common/fabric-styles/styles';
import ProductSettings from '../productSettings/ProductSettings';
import { IPanelInfo } from '../../interfaces/index';
import Reports from '../reports/Reports';
import ProductCategory from '../product-category/ProductCategories';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const isCollapseMenu = useSelector<IApplicationState, boolean>(
    (state) => state.control.isCollapseMenu
  );
  const panelInfo = useSelector<IApplicationState, IPanelInfo>(
    (state) => state.control.panelInfo
  );

  const location = useLocation();

  const dismissPanelInfo = () => {
    dispatch(controlAction.closeInfoPanelWithComponent());
  };

  return (
    <>
      <Header />
      <main className={isCollapseMenu ? 'collapse' : ''}>
        <Menu />

        <Panel
          type={PanelType.smallFixedNear}
          isBlocking={false}
          styles={stylesPanelInfo}
          isOpen={panelInfo.isOpenPanelInfo}
          onDismiss={dismissPanelInfo}>
          <PrivateRoute
            path={location.pathname}
            component={panelInfo.componentInPanelInfo}
          />
        </Panel>

        <div className="content">
          <Switch>
            <PrivateRoute path={`/en/app/dealers`} component={Dealers} />
            <PrivateRoute path={`/en/app/customer`} component={Customers} />
            <PrivateRoute
              path={`/en/app/product-category`}
              component={ProductCategory}
            />
            <PrivateRoute
              path={`/en/app/product-settings`}
              component={ProductSettings}
            />
            <PrivateRoute path={`/en/app/reports`} component={Reports} />
          </Switch>
        </div>
      </main>

      <Footer />

      <CommonDialog />
    </>
  );
};

export default Dashboard;
