import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory, Measurement } from '../../../interfaces';
import {
  Stack,
  Text,
  CommandBarButton,
  FontWeights,
  Separator,
  Image,
  ScrollablePane,
  Label,
  PrimaryButton,
  IImageProps,
} from 'office-ui-fabric-react';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  scrollablePaneStyleForDetailList,
} from '../../../common/fabric-styles/styles';
import {
  measurementActions,
  ManagingMeasurementPanelComponent,
} from '../../../redux/slices/measurement.slice';
import NoMeasurementImg from '../../../assets/images/no-objects/noneMeasurement.svg';
import ProductMeasurementSelector from './ProductMeasurementSelector';
import ProductMeasurementChartGrid from './ProductMeasurementChartGrid';

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
  >((state) => state.measurements.targetMeasurement);

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
    debugger;
    // dispatch(
    //   measurementActions.changeManagingMeasurementPanelContent(
    //     ManagingMeasurementPanelComponent.CreateNewMeasurement
    //   )
    // );
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
                  <Text variant="xLarge" nowrap block styles={mainTitleContent}>
                    Measurements
                  </Text>

                  <CommandBarButton
                    text="New measurement"
                    styles={{
                      root: {
                        height: '30px',
                        padding: '16px',
                      },
                    }}
                    onClick={() => addMeasurement()}
                    iconProps={{ iconName: 'Add' }}
                  />
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

                  <CommandBarButton
                    disabled={targetProductMeasurement ? false : true}
                    text="New size"
                    styles={{
                      root: {
                        height: '30px',
                        padding: '16px',
                      },
                      label: {
                        fontWeight: FontWeights.regular,
                      },
                    }}
                    onClick={() => {
                      if (targetProductMeasurement) {
                        dispatch(
                          measurementActions.changeManagingMeasurementPanelContent(
                            ManagingMeasurementPanelComponent.AddChartSize
                          )
                        );
                      }
                    }}
                    iconProps={{ iconName: 'InsertRowsBelow' }}
                  />

                  <Separator vertical />

                  <Stack horizontal tokens={{ childrenGap: '0px' }}>
                    <Stack horizontal>
                      <CommandBarButton
                        text="Edit"
                        disabled={targetProductMeasurement ? false : true}
                        styles={{
                          root: {
                            height: '30px',
                            padding: '16px',
                          },
                          label: {
                            fontWeight: FontWeights.regular,
                          },
                        }}
                        onClick={() => {
                          if (targetProductMeasurement) {
                            dispatch(
                              measurementActions.changeManagingMeasurementPanelContent(
                                ManagingMeasurementPanelComponent.EditMeasurement
                              )
                            );
                          }
                        }}
                        iconProps={{ iconName: 'Edit' }}
                      />

                      <CommandBarButton
                        text="Delete"
                        disabled={targetProductMeasurement ? false : true}
                        styles={{
                          root: {
                            height: '30px',
                            padding: '16px',
                          },
                          label: {
                            fontWeight: FontWeights.light,
                          },
                        }}
                        onClick={() => {
                          if (targetProductMeasurement) {
                          }
                        }}
                        iconProps={{
                          iconName: 'Cancel',
                          styles: {
                            root: {
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#a4373a',
                            },
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
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
                <Stack>
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
