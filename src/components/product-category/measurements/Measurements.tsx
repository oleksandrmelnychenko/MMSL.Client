import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory, Measurement } from '../../../interfaces';
import {
  Stack,
  Text,
  Image,
  ScrollablePane,
  Label,
  PrimaryButton,
  IImageProps,
  Separator,
  FontWeights,
} from 'office-ui-fabric-react';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  scrollablePaneStyleForDetailList,
  mainTitleHintContent,
} from '../../../common/fabric-styles/styles';
import NoMeasurementImg from '../../../assets/images/no-objects/noneMeasurement.svg';
import ProductMeasurementSelector from './ProductMeasurementSelector';
import ProductMeasurementChartGrid from './ProductMeasurementChartGrid';
import { controlActions } from '../../../redux/slices/control.slice';
import MeasurementForm from './management/MeasurementForm';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const dispatch = useDispatch();

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const isProductMeasurementsWasRequested: boolean = useSelector<
    IApplicationState,
    boolean
  >(
    (state) => state.product.productMeasurementsState.isMeasurementsWasRequested
  );

  const isAnyProductMeasurements: boolean = useSelector<
    IApplicationState,
    boolean
  >(
    (state) => state.product.productMeasurementsState.measurementList.length > 0
  );

  const targetProductMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    return () => {};
  }, [targetProduct]);

  const hintContentHideableStyle =
    isProductMeasurementsWasRequested && !isAnyProductMeasurements
      ? { height: '100%' }
      : { display: 'none' };

  const imageProps: Partial<IImageProps> = {
    styles: {
      root: {
        margin: '0 auto',
      },
    },
  };

  const mainContentHideableStyle =
    isProductMeasurementsWasRequested && isAnyProductMeasurements
      ? {}
      : { display: 'none' };

  const addMeasurement = () => {
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
              root: { ...scrollablePaneStyleForDetailList.root, top: '140px' },
            }}
          >
            <div style={mainContentHideableStyle}>
              {targetProductMeasurement ? (
                <ProductMeasurementChartGrid />
              ) : null}
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
                  styles={{ root: { position: 'relative', top: '-131px' } }}
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
                    Create your first measurement
                  </Label>
                  <Stack.Item align={'center'}>
                    <PrimaryButton
                      text={'Create measurement'}
                      onClick={() => addMeasurement()}
                    />
                  </Stack.Item>
                </Stack>
              </div>
            </div>
          </ScrollablePane>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default Measurements;
