import React, { useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import { List } from 'linq-typescript';
import { productActions } from '../../redux/slices/product.slice';
import { controlActions } from '../../redux/slices/control.slice';
import Dealers from './Dealers';
import DealerProducts from './products/DealerProducts';
import DealerProductsPanel from './options/DealerProductsPanel';
import { DealerAccount } from '../../interfaces/dealer';
import DealerOptions from './options/DealerOptions';
import { dealerActions } from '../../redux/slices/dealer.slice';

const _extractDealerIdFromPath = (history: any) => {
  const lastSegment: any = new List(
    history.location.pathname.split('/')
  ).lastOrDefault();

  return parseInt(lastSegment ? lastSegment : '');
};

export const DEALERS_PATH: string = '/en/app/dealers';
export const DEALER_AVAILABLE_PRODUCTS: string =
  '/en/app/dealers/available-products/';

const DealersBootstrapper: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const dealer: DealerAccount | null = useSelector<
    IApplicationState,
    DealerAccount | null
  >((state) => state.dealer.selectedDealer);

  useEffect(() => {
    if (history?.location?.pathname?.includes(DEALER_AVAILABLE_PRODUCTS)) {
      resolveTargetDealerFlow(DealerProductsPanel);
    } else {
      if (dealer) {
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: DealerOptions,
            onDismisPendingAction: () => {
              dispatch(dealerActions.setSelectedDealer(null));
            },
          })
        );
      } else {
        dispatch(controlActions.closeInfoPanelWithComponent());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const resolveTargetDealerFlow = (optionsLeftPanelComponent: any) => {
    if (!dealer) {
      const dealerId: number = _extractDealerIdFromPath(history);

      if (dealerId && !isNaN(dealerId)) {
        dispatch(
          assignPendingActions(
            dealerActions.getAndSelectDealerById(dealerId),
            [],
            [],
            (args: any) => {
              dispatch(productActions.chooseProductCategory(args));
              dispatch(
                controlActions.openInfoPanelWithComponent({
                  component: optionsLeftPanelComponent,
                  onDismisPendingAction: () => {
                    history.push(DEALERS_PATH);
                  },
                })
              );
            }
          )
        );
      }
    } else {
      dispatch(
        controlActions.openInfoPanelWithComponent({
          component: optionsLeftPanelComponent,
          onDismisPendingAction: () => {
            history.push(DEALERS_PATH);
          },
        })
      );
    }
  };

  return (
    <div>
      <Switch>
        <Route
          path={`${DEALER_AVAILABLE_PRODUCTS}:dealerId`}
          component={DealerProducts}
        />
        <Route path={DEALERS_PATH} component={Dealers} />
      </Switch>
    </div>
  );
};

export default DealersBootstrapper;
