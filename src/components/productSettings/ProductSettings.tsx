import './productSettings.scss';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Stack, ActionButton, SearchBox } from 'office-ui-fabric-react';
import ProductSettingsList from './ProductSettingsList';
import ProductSettingsManagementPanel from './productSettingManagement/ProductSettingsManagementPanel';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../redux/reducers/productSettings.reducer';

export const ProductSettings: React.FC = (props: any) => {
  const dispatch = useDispatch();

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
                            dispatch(
                              productSettingsActions.managingPanelContent(
                                ManagingPanelComponent.ManageGroups
                              )
                            );
                          }}
                          iconProps={{ iconName: 'Add' }}>
                          New product setting
                        </ActionButton>
                      </div>
                      <div className="productSettings__header__top__controls__control">
                        <SearchBox
                          className="productSettingsSearch"
                          value={''}
                          styles={searchBoxStyles}
                          placeholder="Find product settings"
                          onChange={(args: any) => {
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
          <Stack.Item>
            <ProductSettingsList />
          </Stack.Item>
        </Stack>

        <ProductSettingsManagementPanel />
      </div>
    </div>
  );
};

export default ProductSettings;
