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
import { measurementActions } from '../../../redux/slices/measurement.slice';
import { productActions } from '../../../redux/slices/product.slice';
import NoMeasurementImg from '../../../assets/images/no-objects/noneMeasurement.svg';
import ProductMeasurementSelector from './ProductMeasurementSelector';
import ProductMeasurementChartGrid from './ProductMeasurementChartGrid';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import MeasurementForm from './management/MeasurementForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';
import SizesForm from './management/SizesForm';

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

  /* Old pattern need to be removed */
  // const measurements: Measurement[] = useSelector<
  //   IApplicationState,
  //   Measurement[]
  // >((state) => state.product.productMeasurementsState.measurementList);

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

  /* Old pattern need to be removed */
  // const deleteMeasurement = () => {
  //   if (targetProductMeasurement) {
  //     dispatch(
  //       controlActions.toggleCommonDialogVisibility(
  //         new DialogArgs(
  //           CommonDialogType.Delete,
  //           'Delete measurement',
  //           `Are you sure you want to delete ${targetProductMeasurement.name}?`,
  //           () => {
  //             dispatch(
  //               /// Delete measurement
  //               assignPendingActions(
  //                 measurementActions.apiDeleteMeasurementById(
  //                   targetProductMeasurement.id
  //                 ),
  //                 [],
  //                 [],
  //                 (args: any) => {
  //                   dispatch(
  //                     /// Clear target delete measurement
  //                     productActions.changeSelectedProductMeasurement(null)
  //                   );
  //                   const updatedMeasurements = new List(measurements)
  //                     .where((item) => item.id !== args.body)
  //                     .toArray();

  //                   dispatch(
  //                     productActions.updateProductMeasurementsList(
  //                       updatedMeasurements
  //                     )
  //                   );

  //                   if (updatedMeasurements.length > 0) {
  //                     dispatch(
  //                       /// Select first measurement
  //                       assignPendingActions(
  //                         measurementActions.apiGetMeasurementById(
  //                           updatedMeasurements[0].id
  //                         ),
  //                         [],
  //                         [],
  //                         (args: any) => {
  //                           dispatch(
  //                             productActions.changeSelectedProductMeasurement(
  //                               args
  //                             )
  //                           );
  //                         },
  //                         (args: any) => {}
  //                       )
  //                     );
  //                   }
  //                 }
  //               )
  //             );
  //           },
  //           () => {}
  //         )
  //       )
  //     );
  //   }
  // };

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

  /* Old pattern need to be removed */
  // const editMeasurement = () => {
  //   if (targetProductMeasurement) {
  //     dispatch(
  //       productActions.changeProductMeasurementForEdit(targetProductMeasurement)
  //     );

  //     dispatch(
  //       controlActions.openRightPanel({
  //         title: 'Edit Measurement',
  //         description: targetProductMeasurement.name,
  //         width: '400px',
  //         closeFunctions: () => {
  //           dispatch(controlActions.closeRightPanel());
  //           dispatch(productActions.changeProductMeasurementForEdit(null));
  //         },
  //         component: MeasurementForm,
  //       })
  //     );
  //   }
  // };

  // Old pattern need to be removed
  // const addNewSize = () => {
  //   if (targetProductMeasurement) {
  //     dispatch(
  //       controlActions.openRightPanel({
  //         title: 'Add size',
  //         description: targetProductMeasurement.name,
  //         width: '400px',
  //         closeFunctions: () => {
  //           dispatch(controlActions.closeRightPanel());
  //         },
  //         component: SizesForm,
  //       })
  //     );
  //   }
  // };

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
                  {/* Old pattern need to be removed  */}
                  {/* <CommandBarButton
                    text="New measurement"
                    styles={{
                      root: {
                        height: '30px',
                        padding: '16px',
                      },
                    }}
                    onClick={() => addMeasurement()}
                    iconProps={{ iconName: 'Add' }}
                  /> */}
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

                  {/* Old pattern need to be removed */}
                  {/* <CommandBarButton
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
                    onClick={() => addNewSize()}
                    iconProps={{ iconName: 'InsertRowsBelow' }}
                  /> */}

                  {/* Old pattern need to be removed */}
                  {/* <Separator vertical /> */}

                  <Stack horizontal tokens={{ childrenGap: '0px' }}>
                    <Stack horizontal>
                      {/* Old pattern need to be removed */}
                      {/* <CommandBarButton
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
                        onClick={() => editMeasurement()}
                        iconProps={{ iconName: 'Edit' }}
                      /> */}

                      {/* Old pattern need to be removed */}
                      {/* <CommandBarButton
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
                        onClick={() => deleteMeasurement()}
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
                      /> */}
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
