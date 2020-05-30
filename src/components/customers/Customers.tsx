import './customers.scss';
import React, { useEffect } from 'react';
import { SearchBox, ActionButton, Text, Stack } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import CustomerList from './CustomerList';
import { customerActions } from '../../redux/slices/customer.slice';
import {
  controlActions,
  RightPanelProps,
} from '../../redux/slices/control.slice';
import {
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import ManageCustomerForm from '../customers/customerManaging/ManageCustomerForm';

export const Customers: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchText = useSelector<IApplicationState, string>(
    (state) => state.customer.customerState.search
  );
  const searchByStoreText = useSelector<IApplicationState, string>(
    (state) => state.customer.customerState.searchByStore
  );

  useEffect(() => {
    return () => {
      dispatch(controlActions.closeInfoPanelWithComponent());
      dispatch(customerActions.clearCustomerList());
    };
  }, []);
  const searchBoxStyles = { root: { width: 200 } };

  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <Stack
                horizontal
                verticalAlign="center"
                tokens={horizontalGapStackTokens}>
                <Text variant="xLarge" block styles={mainTitleContent}>
                  Customers
                </Text>
                <ActionButton
                  className="customersAdd"
                  onClick={() => {
                    dispatch(customerActions.selectedCustomer(null));
                    dispatch(
                      controlActions.openRightPanel({
                        title: 'New Customer',
                        width: '400px',
                        closeFunctions: () => {
                          dispatch(controlActions.closeRightPanel());
                        },
                        component: ManageCustomerForm,
                      })
                    );
                  }}
                  iconProps={{ iconName: 'Add' }}>
                  New customer
                </ActionButton>
                <SearchBox
                  className="customersSearch"
                  value={searchText}
                  styles={searchBoxStyles}
                  placeholder="Find customer"
                  onChange={(args: any) => {
                    if (args) {
                      let value = args.target.value;
                      dispatch(customerActions.searchCustomer(value));
                      dispatch(customerActions.getCustomersListPaginated());
                    } else {
                      dispatch(customerActions.searchCustomer(''));
                      dispatch(customerActions.getCustomersListPaginated());
                    }
                  }}
                />
                <SearchBox
                  className="customersSearch"
                  value={searchByStoreText}
                  styles={searchBoxStyles}
                  placeholder="Find by store"
                  onChange={(args: any) => {
                    if (args) {
                      let value = args.target.value;
                      dispatch(customerActions.searchCustomerByStore(value));
                      dispatch(customerActions.getCustomersListPaginated());
                    } else {
                      dispatch(customerActions.searchCustomerByStore(''));
                      dispatch(customerActions.getCustomersListPaginated());
                    }
                  }}
                />
              </Stack>
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <CustomerList />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default Customers;
