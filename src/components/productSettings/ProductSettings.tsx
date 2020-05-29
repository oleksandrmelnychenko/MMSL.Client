import './productSettings.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  ActionButton,
  Text,
  SearchBox,
  ScrollablePane,
} from 'office-ui-fabric-react';
import ProductSettingsManagementPanel from './productSettingManagement/ProductSettingsManagementPanel';
import { productSettingsActions } from '../../redux/slices/productSettings.slice';
import { ManagingPanelComponent } from '../../redux/slices/productSettings.slice';
import { IApplicationState } from '../../redux/reducers';
import {
  mainTitleContent,
  horizontalGapStackTokens,
  searchBoxStyles,
} from '../../common/fabric-styles/styles';
import StylesList from './StylesList';
import * as fabricStyles from '../../common/fabric-styles/styles';

export const ProductSettings: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.productSettings.searchWordOptionGroup
  );

  useEffect(() => {
    dispatch(productSettingsActions.getBySearchOptionGroups());
  }, [searchWord, dispatch]);

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
                <Text variant="xLarge" nowrap block styles={mainTitleContent}>
                  Styles
                </Text>
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
                  New style
                </ActionButton>
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
              </Stack>
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <ScrollablePane
            styles={fabricStyles.scrollablePaneStyleForStylesList}>
            <StylesList />
          </ScrollablePane>
        </Stack.Item>
      </Stack>
      <ProductSettingsManagementPanel />
    </div>
  );
};

export default ProductSettings;
