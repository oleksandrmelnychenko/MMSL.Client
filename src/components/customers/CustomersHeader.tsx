import React, { useEffect } from 'react';
import { SearchBox, ActionButton, Text, Stack } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { customerActions } from '../../redux/slices/customer/customer.slice';
import { controlActions } from '../../redux/slices/control.slice';
import { rightPanelActions } from '../../redux/slices/rightPanel.slice';
import {
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import ManageCustomerForm from '../customers/customerManaging/ManageCustomerForm';

export const CustomersHeader: React.FC = (props: any) => {
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
      dispatch(customerActions.updateCustomersList([]));
    };
  }, [dispatch]);
  const searchBoxStyles = { root: { width: 200 } };

  return (
    <Stack horizontal verticalAlign="center" tokens={horizontalGapStackTokens}>
      <Text variant="xLarge" block styles={mainTitleContent}>
        Customers
      </Text>
      <ActionButton
        className="customersAdd"
        onClick={() => {
          dispatch(customerActions.updateSelectedCustomer(null));
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'New Customer',
              width: '400px',
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
              },
              component: ManageCustomerForm,
            })
          );
        }}
        iconProps={{ iconName: 'Add' }}
      >
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
  );
};

export default CustomersHeader;
