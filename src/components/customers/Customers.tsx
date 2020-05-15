import './customers.scss';
import React from 'react';
import { SearchBox, ActionButton, Stack } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import CustomerList from './CustomerList';

export const Customers: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchText = useSelector<IApplicationState, string>(
    (state) => state.dealer.dealerState.search
  );

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
                            debugger;
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
                          styles={{ root: { width: 200 } }}
                          onChange={(args: any) => {
                            ///TODO
                            debugger;
                            // if (args) {
                            //   let value = args.target.value;
                            //   dispatch(dealerActions.searchDealer(value));
                            //   dispatch(dealerActions.getDealersListPaginated());
                            // } else {
                            //   dispatch(dealerActions.searchDealer(''));
                            //   dispatch(dealerActions.getDealersListPaginated());
                            // }
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
