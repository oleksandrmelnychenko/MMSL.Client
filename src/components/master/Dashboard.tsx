import React from 'react';
import * as dealerActions from '../../redux/actions/dealer.actions';
import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import { Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Dealers from '../dealers/Dealers';
import Customers from '../customers/Customers';
import CommonDialog from './CommonDialog';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as controlAction from '../../redux/actions/control.actions';

import ManagementOptions from '../dealers/dealerManaging/ManagementOptions';
import { stylesPanelInfo } from '../../common/fabric-styles/styles';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const isCollapseMenu = useSelector<IApplicationState, boolean>(
    (state) => state.control.isCollapseMenu
  );
  const isOpenPanelInfo = useSelector<IApplicationState, boolean>(
    (state) => state.control.isOpenPanelInfo
  );

  const dismissPanelInfo = () => {
    dispatch(dealerActions.setSelectedDealer(null));
    dispatch(controlAction.isOpenPanelInfo(false));
    dispatch(controlAction.isCollapseMenu(false));
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
          isOpen={isOpenPanelInfo}
          onDismiss={dismissPanelInfo}>
          <ManagementOptions />
        </Panel>

        <div className="content">
          <Switch>
            <PrivateRoute path={`/en/app/dealers`} component={Dealers} />
            <PrivateRoute path={`/en/app/customer`} component={Customers} />
          </Switch>
        </div>
      </main>

      <Footer />

      <CommonDialog />
    </>
  );
};

export default Dashboard;
