import './productSettings.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  Text,
  SearchBox,
  Image,
  ScrollablePane,
  Label,
  PrimaryButton,
  IImageProps,
  Separator,
  FontWeights,
} from 'office-ui-fabric-react';
import ProductSettingsManagementPanel from './productSettingManagement/ProductSettingsManagementPanel';
import {
  productSettingsActions,
  ManagingPanelComponent,
} from '../../redux/slices/productSettings.slice';
import { IApplicationState } from '../../redux/reducers';
import {
  mainTitleContent,
  horizontalGapStackTokens,
  searchBoxStyles,
  mainTitleHintContent,
} from '../../common/fabric-styles/styles';
import StylesList from './StylesList';
import * as fabricStyles from '../../common/fabric-styles/styles';
import { ProductCategory } from '../../interfaces';
import NoMeasurementImg from '../../assets/images/no-objects/noneMeasurement.svg';

export const ProductSettings: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const isStylesWasRequested: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.productSettings.isStylesWasRequested
  );

  const showHint: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.productSettings.showHint
  );

  const isAnyStyles: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.productSettings.optionGroupsList.length > 0
  );

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.productSettings.searchWordOptionGroup
  );

  useEffect(() => {
    if (targetProduct?.id)
      dispatch(
        productSettingsActions.apiSearchOptionGroupsByProductIdList(
          targetProduct.id
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord, dispatch]);

  // const hintContentHideableStyle =
  //   isStylesWasRequested && !isAnyStyles
  //     ? { height: '100%' }
  //     : { display: 'none' };

  const hintContentHideableStyle = showHint
    ? { height: '100%' }
    : { display: 'none' };

  const imageProps: Partial<IImageProps> = {
    styles: {
      root: {
        margin: '0 auto',
      },
    },
  };

  // const mainContentHideableStyle =
  //   isStylesWasRequested && isAnyStyles ? {} : { display: 'none' };
  const mainContentHideableStyle = !showHint ? {} : { display: 'none' };

  const addNewStyle = () => {
    if (targetProduct) {
      dispatch(
        productSettingsActions.managingPanelContent(
          ManagingPanelComponent.ManageGroups
        )
      );
    }
  };

  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div
              className="content__header__top"
              style={mainContentHideableStyle}
            >
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
          <ScrollablePane
            styles={fabricStyles.scrollablePaneStyleForStylesList}
          >
            <div style={mainContentHideableStyle}>
              {targetProduct ? <StylesList /> : null}
            </div>
            <div style={hintContentHideableStyle}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'inherit',
                }}
              >
                <Stack
                  styles={{ root: { position: 'relative', top: '-99px' } }}
                >
                  <Image {...imageProps} src={NoMeasurementImg} />
                  <Label
                    styles={{
                      root: {
                        color: '#484848',
                        fontSize: '18px',
                      },
                    }}
                  >
                    Create your first style
                  </Label>
                  <Stack.Item align={'center'}>
                    <PrimaryButton
                      text={'Create style'}
                      onClick={() => addNewStyle()}
                    />
                  </Stack.Item>
                </Stack>
              </div>
            </div>
          </ScrollablePane>
        </Stack.Item>
      </Stack>
      {/* TODO: use new pattern */}
      <ProductSettingsManagementPanel />
    </div>
  );
};

export default ProductSettings;
