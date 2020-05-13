import React from 'react';

import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import { Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Dealers from '../dealers/Dealers';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as controlAction from '../../redux/actions/control.actions';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const isCollapseMenu = useSelector<IApplicationState, boolean>(
    (state) => state.control.isCollapseMenu
  );
  const isOpenPanelInfo = useSelector<IApplicationState, boolean>(
    (state) => state.control.isOpenPanelInfo
  );

  const stylesPanelInfo = {
    main: {
      left: '46px',
      top: '51px',
      height: 'calc(100vh - 77px)',
      boxShadow:
        'rgba(0, 0, 0, 0.22) 3px 4px 3px 0px, rgba(0, 0, 0, 0.18) 3px 1px 6px 0px;',
    },
  };

  const dismissPanelInfo = () => {
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
          headerText="Non-modal panel"
          // this prop makes the panel non-modal
          isBlocking={false}
          styles={stylesPanelInfo}
          isOpen={isOpenPanelInfo}
          onDismiss={dismissPanelInfo}
          closeButtonAriaLabel="Close">
          <p>INFO</p>
        </Panel>

        <div className="content">
          <Switch>
            <PrivateRoute path={`/en/app/dealers`} component={Dealers} />
          </Switch>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Dashboard;
