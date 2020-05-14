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
import { Panel, PanelType, PrimaryButton, Label } from 'office-ui-fabric-react';
import * as controlAction from '../../redux/actions/control.actions';
import * as dealerAction from '../../redux/actions/dealer.actions';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../redux/reducers/dealer.reducer';

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

  const btnStyle = {
    root: {
      minWidth: '90px',
      width: '90px',
      height: '90px',
      paddingRight: '0px',
      border: 'none',
      rootHovered: {
        border: 'none',
      },
    },
  };

  const labelStyle = {
    root: {
      fontSize: '14px',
      textAlign: 'center',
      'font-weight': 400,
      cursor: 'pointer',
      transition: 'all 0.3s ease',

      selectors: {
        '&:hover': {
          background: '#faf9f8',
          textDecoration: 'underline',
        },
      },
    },
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
          <div className="dealer__management">
            <Label styles={labelStyle}>
              <PrimaryButton
                styles={btnStyle}
                className="dealer__management__btn-add"
                onClick={() => {
                  const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
                  openDetailsArgs.isOpen = true;
                  openDetailsArgs.componentType =
                    DealerDetilsComponents.DealerStores;

                  dispatch(
                    dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
                  );
                }}
                allowDisabledFocus
              />
              Stores
            </Label>
            <Label styles={labelStyle}>
              <PrimaryButton
                className="dealer__management__btn-detail"
                styles={btnStyle}
                onClick={() => {
                  const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
                  openDetailsArgs.isOpen = true;
                  openDetailsArgs.componentType =
                    DealerDetilsComponents.DealerDetails;

                  dispatch(
                    dealerAction.isOpenPanelWithDealerDetails(openDetailsArgs)
                  );
                }}
                allowDisabledFocus
              />
              Details
            </Label>
          </div>
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
