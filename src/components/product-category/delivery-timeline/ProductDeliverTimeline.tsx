import React, { useEffect } from 'react';
import { Text, ScrollablePane, Stack, Separator } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  scrollablePaneStyleForDetailListWithDoubleHeader,
  mainTitleHintContent,
} from '../../../common/fabric-styles/styles';
import { ProductCategory } from '../../../interfaces/products';
import { IApplicationState } from '../../../redux/reducers/index';
import ProductDeliverTimelineForm from './ProductDeliverTimelineForm';
import DeliveriesList from './DeliveriesList';

export const CREATE_YOUR_FIRST_TIMELINE: string = 'Create your first timeline';
export const CREATE_TIMELINE: string = 'Create timeline';

export const ProductDeliverTimeline: React.FC = () => {
  const dispatch = useDispatch();

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  /// Dispose own state
  useEffect(() => {
    return () => {
      dispatch(controlActions.closeDashboardHintStub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// Listen to `global` product changes
  useEffect(() => {
    if (targetProduct && targetProduct.deliveryTimelineProductMaps) {
      if (targetProduct.deliveryTimelineProductMaps.length > 0) {
        dispatch(controlActions.closeDashboardHintStub());
      } else {
        dispatch(
          controlActions.showDashboardHintStub({
            isVisible: true,
            title: CREATE_YOUR_FIRST_TIMELINE,
            buttonLabel: CREATE_TIMELINE,
            buttonAction: () => {
              dispatch(
                controlActions.openRightPanel({
                  title: 'New timeline',
                  width: '400px',
                  closeFunctions: () => {
                    dispatch(controlActions.closeRightPanel());
                  },
                  component: ProductDeliverTimelineForm,
                })
              );
            },
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProduct]);

  return (
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
                  <Text variant="xLarge" nowrap block styles={mainTitleContent}>
                    Delivery timeline
                  </Text>

                  <Separator vertical />

                  <Text variant="xLarge" styles={mainTitleHintContent}>
                    {targetProduct ? targetProduct.name : ''}
                  </Text>
                </Stack>
              </Stack>
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <ScrollablePane
            styles={scrollablePaneStyleForDetailListWithDoubleHeader}
          >
            <DeliveriesList />
          </ScrollablePane>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductDeliverTimeline;
