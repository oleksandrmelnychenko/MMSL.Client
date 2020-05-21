import './productSettings.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  ActionButton,
  SearchBox,
  Separator,
} from 'office-ui-fabric-react';
import ProductSettingsList from './ProductSettingsList';
import ProductSettingsManagementPanel from './productSettingManagement/ProductSettingsManagementPanel';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../redux/reducers/productSettings.reducer';
import { IApplicationState } from '../../redux/reducers';

export const ProductSettings: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchBoxStyles = { root: { width: 200 } };

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.productSettings.searchWordOptionGroup
  );

  useEffect(() => {
    dispatch(productSettingsActions.getBySearchOptionGroups());
  }, [searchWord, dispatch]);

  return (
    <div className="productSettings">
      <div className="productSettings__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="productSettings__header">
              <div className="productSettings__header__top">
                <Stack horizontal>
                  <div className="productSettings__header__top__title">
                    Settings
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
                          iconProps={{ iconName: 'Add' }}
                        >
                          New group
                        </ActionButton>
                      </div>
                      <div className="productSettings__header__top__controls__control">
                        <SearchBox
                          className="productSettingsSearch"
                          value={searchWord}
                          styles={searchBoxStyles}
                          onChange={(args: any) => {
                            let value = args?.target?.value;

                            dispatch(
                              productSettingsActions.updateSearchWordOptionGroup(
                                value ? value : ''
                              )
                            );
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
