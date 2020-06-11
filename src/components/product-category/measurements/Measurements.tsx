import React from 'react';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import { Stack, Text, ScrollablePane, Separator } from 'office-ui-fabric-react';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  scrollablePaneStyleForDetailList,
  mainTitleHintContent,
} from '../../../common/fabric-styles/styles';
import ProductMeasurementSelector from './ProductMeasurementSelector';
import ProductMeasurementChartGrid from './chartsGrid/ProductMeasurementChartGrid';

export const CREATE_YOUR_FIRST_MEASUREMENT: string =
  'Create your first measurement';
export const CREATE_MEASUREMENT: string = 'Create measurement';
export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  return (
    <>
      <div className="content__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="content__header">
              <div className="content__header__top">
                <Stack tokens={{ childrenGap: 14 }}>
                  <Stack horizontal tokens={horizontalGapStackTokens}>
                    <Stack horizontal tokens={{ childrenGap: '10px' }}>
                      <Text
                        variant="xLarge"
                        nowrap
                        block
                        styles={mainTitleContent}
                      >
                        Measurements
                      </Text>

                      <Separator vertical />

                      <Text variant="xLarge" styles={mainTitleHintContent}>
                        {targetProduct ? targetProduct.name : ''}
                      </Text>
                    </Stack>
                  </Stack>

                  <Stack
                    horizontal
                    tokens={{
                      ...horizontalGapStackTokens,
                      childrenGap: 6,
                      padding: '18px 5px 10px 8px',
                    }}
                  >
                    <ProductMeasurementSelector />
                  </Stack>
                </Stack>
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>
            <ScrollablePane
              styles={{
                ...scrollablePaneStyleForDetailList,
                root: {
                  ...scrollablePaneStyleForDetailList.root,
                  top: '140px',
                },
              }}
            >
              <ProductMeasurementChartGrid />
            </ScrollablePane>
          </Stack.Item>
        </Stack>
      </div>
    </>
  );
};

export default Measurements;
