import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory, Measurement } from '../../../interfaces';
import { Stack, Text, ScrollablePane, Separator } from 'office-ui-fabric-react';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  scrollablePaneStyleForDetailList,
  mainTitleHintContent,
} from '../../../common/fabric-styles/styles';
import ProductMeasurementSelector from './ProductMeasurementSelector';
import ProductMeasurementChartGrid from './chartsGrid/ProductMeasurementChartGrid';
import { controlActions } from '../../../redux/slices/control.slice';
import MeasurementForm from './management/MeasurementForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import { productActions } from '../../../redux/slices/product.slice';
import { measurementActions } from '../../../redux/slices/measurement.slice';
import { List } from 'linq-typescript';

export const CREATE_YOUR_FIRST_MEASUREMENT: string =
  'Create your first measurement';
export const CREATE_MEASUREMENT: string = 'Create measurement';
export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const dispatch = useDispatch();

  const [localProduct, setLocalProduct] = useState<
    ProductCategory | null | undefined
  >(null);
  const [isWasInited, setIsWasInited] = useState<boolean>(false);

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const isAnyMeasurements: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.product.productMeasurementsState.measurementList.length > 0
  );

  useEffect(() => {
    return () => {
      setLocalProduct(null);
      setIsWasInited(false);
    };
  }, []);

  useEffect(() => {
    if (targetProduct && targetProduct.id !== localProduct?.id) {
      setLocalProduct(targetProduct);
    }
  }, [targetProduct]);

  useEffect(() => {
    if (targetProduct) {
      dispatch(
        assignPendingActions(
          productActions.apiGetAllProductMeasurementsByProductId(
            targetProduct.id
          ),
          [],
          [],
          (args: any) => {
            setIsWasInited(true);
            dispatch(productActions.updateProductMeasurementsList(args));

            const measurementId = new List<Measurement>(args).firstOrDefault()
              ?.id;

            if (measurementId) {
              dispatch(
                assignPendingActions(
                  measurementActions.apiGetMeasurementById(measurementId),
                  [],
                  [],
                  (args: any) => {
                    dispatch(
                      productActions.changeSelectedProductMeasurement(args)
                    );
                  },
                  (args: any) => {}
                )
              );
            }
          },
          (args: any) => {}
        )
      );
    } else {
      dispatch(productActions.updateProductMeasurementsList([]));
    }

    return () => {};
  }, [localProduct]);

  useEffect(() => {
    if (isWasInited) {
      if (isAnyMeasurements) {
        dispatch(controlActions.closeDashboardHintStub());
      } else {
        dispatch(
          controlActions.showDashboardHintStub({
            isVisible: true,
            title: CREATE_YOUR_FIRST_MEASUREMENT,
            buttonLabel: CREATE_MEASUREMENT,
            buttonAction: () => {
              dispatch(
                controlActions.openRightPanel({
                  title: 'New Measurement',
                  width: '400px',
                  closeFunctions: () => {
                    dispatch(controlActions.closeRightPanel());
                  },
                  component: MeasurementForm,
                })
              );
            },
          })
        );
      }
    }
  }, [isWasInited, isAnyMeasurements]);

  return (
    <>
      {isWasInited ? (
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
      ) : null}
    </>
  );
};

export default Measurements;
