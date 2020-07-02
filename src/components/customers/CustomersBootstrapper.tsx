import React, { useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import { List } from 'linq-typescript';
import { productActions } from '../../redux/slices/product.slice';
import { controlActions } from '../../redux/slices/control.slice';
import {
  CustomerListState,
  customerActions,
} from '../../redux/slices/customer/customer.slice';
import CustomersOptionsPanel, {
  onDismisActionsCustomersOptionsPanel,
} from './options/CustomersOptionsPanel';
import CustomerProfileOptiosPanel from './options/CustomerProfileOptiosPanel';
import Customers from './Customers';
import Profiles from './profile/Profiles';

const _extractCustomerIdFromPath = (history: any) => {
  const lastSegment: any = new List(
    history.location.pathname.split('/')
  ).lastOrDefault();

  return parseInt(lastSegment ? lastSegment : '');
};

export const CUSTOMERS_PATH: string = '/en/app/customers/';
export const CUSTOMER_PROFILES_PATH: string = '/en/app/customers/profiles/';

const CustomersBootstrapper: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();

  const { selectedCustomer } = useSelector<
    IApplicationState,
    CustomerListState
  >((state) => state.customer.customerState);

  useEffect(() => {
    if (history?.location?.pathname?.includes(CUSTOMER_PROFILES_PATH)) {
      resolveTargetCustomerFlow(CustomerProfileOptiosPanel);
    } else {
      if (selectedCustomer) {
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: CustomersOptionsPanel,
            onDismisPendingAction: () =>
              onDismisActionsCustomersOptionsPanel().forEach((action) => {
                dispatch(action);
              }),
          })
        );
      } else {
        dispatch(controlActions.closeInfoPanelWithComponent());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const resolveTargetCustomerFlow = (optionsLeftPanelComponent: any) => {
    if (!selectedCustomer) {
      const customerId: number = _extractCustomerIdFromPath(history);

      if (customerId && !isNaN(customerId)) {
        dispatch(
          assignPendingActions(
            customerActions.apiGetCustomerById(customerId),
            [],
            [],
            (args: any) => {
              dispatch(customerActions.updateSelectedCustomer(args));
              dispatch(
                controlActions.openInfoPanelWithComponent({
                  component: optionsLeftPanelComponent,
                  onDismisPendingAction: () => {
                    history.push(CUSTOMERS_PATH);
                  },
                })
              );
            }
          )
        );
      } else {
        history.push(CUSTOMERS_PATH);
      }
    } else {
      dispatch(
        controlActions.openInfoPanelWithComponent({
          component: optionsLeftPanelComponent,
          onDismisPendingAction: () => {
            history.push(CUSTOMERS_PATH);
          },
        })
      );
    }
  };

  return (
    <Switch>
      <Route
        path={`${CUSTOMER_PROFILES_PATH}:customerId`}
        component={Profiles}
      />
      <Route path={CUSTOMERS_PATH} component={Customers} />
    </Switch>
  );
};

export default CustomersBootstrapper;
