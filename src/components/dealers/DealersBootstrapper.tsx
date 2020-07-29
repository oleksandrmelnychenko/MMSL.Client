import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { infoPanelActions } from '../../redux/slices/infoPanel.slice';
import Dealers from './Dealers';
import { DealerAccount } from '../../interfaces/dealer';
import DealerOptions from './options/DealerOptions';
import { dealerActions } from '../../redux/slices/dealer.slice';
import * as appPaths from '../../common/environment/appPaths/index';

const DealersBootstrapper: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const dealer: DealerAccount | null = useSelector<
    IApplicationState,
    DealerAccount | null
  >((state) => state.dealer.selectedDealer);

  useEffect(() => {
    if (dealer) {
      dispatch(
        infoPanelActions.openInfoPanelWithComponent({
          component: DealerOptions,
          onDismisPendingAction: () => {
            dispatch(dealerActions.setSelectedDealer(null));
          },
        })
      );
    } else {
      dispatch(infoPanelActions.closeInfoPanelWithComponent());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div>
      <Switch>
        <Route path={appPaths.APP_DEALERS} component={Dealers} />
      </Switch>
    </div>
  );
};

export default DealersBootstrapper;
