import './productSettings.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  Text,
  SearchBox,
  ScrollablePane,
  Separator,
} from 'office-ui-fabric-react';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import { IApplicationState } from '../../../redux/reducers';
import {
  mainTitleContent,
  horizontalGapStackTokens,
  searchBoxStyles,
  mainTitleHintContent,
  scrollablePaneStyleForStylesList,
} from '../../../common/fabric-styles/styles';
import StylesList from './StylesList';
import { ProductCategory } from '../../../interfaces/products';

export const CREATE_YOUR_FIRST_STYLE: string = 'Create your first style';
export const CREATE_STYLE: string = 'Create style';
export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export const ProductSettings: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.productSettings.searchWordOptionGroup
  );

  /// Dispose own state
  useEffect(() => {
    return () => {
      dispatch(productSettingsActions.updateOptionGroupList([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (targetProduct?.id)
      dispatch(
        productSettingsActions.apiSearchOptionGroupsByProductIdList(
          targetProduct.id
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord]);

  return (
    <>
      <div className="content__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="content__header">
              <div className="content__header__top">
                <Stack
                  horizontal
                  verticalAlign="center"
                  tokens={horizontalGapStackTokens}
                >
                  <Stack horizontal tokens={{ childrenGap: '10px' }}>
                    <Text variant="xLarge" block styles={mainTitleContent}>
                      Styles
                    </Text>

                    <Separator vertical />

                    <Text variant="xLarge" styles={mainTitleHintContent}>
                      {targetProduct ? targetProduct.name : ''}
                    </Text>
                  </Stack>

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
            <ScrollablePane styles={scrollablePaneStyleForStylesList}>
              <StylesList />
            </ScrollablePane>
          </Stack.Item>
        </Stack>
      </div>
    </>
  );
};

export default ProductSettings;
