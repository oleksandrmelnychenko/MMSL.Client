import './productSettings.scss';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { Stack, ActionButton, SearchBox } from 'office-ui-fabric-react';

export const ProductSettings: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchText = useSelector<IApplicationState, string>(
    (state) => state.customer.customerState.search
  );
  const searchByStoreText = useSelector<IApplicationState, string>(
    (state) => state.customer.customerState.searchByStore
  );

  const searchBoxStyles = { root: { width: 200 } };

  return (
    <div className="productSettings">
      <div className="productSettings__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="productSettings__header">
              <div className="productSettings__header__top">
                <Stack horizontal>
                  <div className="productSettings__header__top__title">
                    Product settings
                  </div>
                  <div className="productSettings__header__top__controls">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                      <div className="productSettings__header__top__controls__control">
                        <ActionButton
                          className="productSettingsAdd"
                          onClick={() => {
                            debugger;

                            // dispatch(
                            //   customerActions.toggleNewCustomerForm(true)
                            // );
                          }}
                          iconProps={{ iconName: 'Add' }}
                        >
                          New product setting
                        </ActionButton>
                      </div>
                      <div className="productSettings__header__top__controls__control">
                        <SearchBox
                          className="productSettingsSearch"
                          value={searchText}
                          styles={searchBoxStyles}
                          placeholder="Find product settings"
                          onChange={(args: any) => {
                            debugger;
                            // if (args) {
                            //   let value = args.target.value;
                            //   dispatch(customerActions.searchCustomer(value));
                            //   dispatch(
                            //     customerActions.getCustomersListPaginated()
                            //   );
                            // } else {
                            //   dispatch(customerActions.searchCustomer(''));
                            //   dispatch(
                            //     customerActions.getCustomersListPaginated()
                            //   );
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
          <Stack.Item>{/* <CustomerList /> */}</Stack.Item>
        </Stack>

        {/* <CreateCustomerPanel /> */}
      </div>
    </div>
  );
};

export default ProductSettings;
