import './customers.scss';
import React from 'react';
import { SearchBox, ActionButton, Stack } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import CustomerList from './CustomerList';
import * as customerActions from '../../redux/actions/customer.actions';

export const Customers: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchText = useSelector<IApplicationState, string>(
    (state) => state.customer.customerState.search
  );
  const searchByStoreText = useSelector<IApplicationState, string>(
    (state) => state.customer.customerState.searchByStore
  );

  const searchBoxStyles = { root: { width: 200 } };

  return (
    <div className="customers">
      <div className="customers__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="customers__header">
              <div className="customers__header__top">
                <Stack horizontal>
                  <div className="customers__header__top__title">Customers</div>
                  <div className="customers__header__top__controls">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                      <div className="customers__header__top__controls__control">
                        <ActionButton
                          className="customersAdd"
                          onClick={() => {
                            ///TODO:
                            // dispatch(dealerActions.toggleNewDealerForm(true));
                          }}
                          iconProps={{ iconName: 'Add' }}
                        >
                          New customer
                        </ActionButton>
                      </div>
                      <div className="customers__header__top__controls__control">
                        <SearchBox
                          className="customersSearch"
                          value={searchText}
                          styles={searchBoxStyles}
                          placeholder="Find customer"
                          onChange={(args: any) => {
                            if (args) {
                              let value = args.target.value;
                              dispatch(customerActions.searchCustomer(value));
                              dispatch(
                                customerActions.getCustomersListPaginated()
                              );
                            } else {
                              dispatch(customerActions.searchCustomer(''));
                              dispatch(
                                customerActions.getCustomersListPaginated()
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="customers__header__top__controls__control">
                        <SearchBox
                          className="customersSearch"
                          value={searchByStoreText}
                          styles={searchBoxStyles}
                          placeholder="Find by store"
                          onChange={(args: any) => {
                            if (args) {
                              let value = args.target.value;
                              dispatch(
                                customerActions.searchCustomerByStore(value)
                              );
                              dispatch(
                                customerActions.getCustomersListPaginated()
                              );
                            } else {
                              dispatch(
                                customerActions.searchCustomerByStore('')
                              );
                              dispatch(
                                customerActions.getCustomersListPaginated()
                              );
                            }
                          }}
                        />
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>
            <CustomerList />
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};

export default Customers;
