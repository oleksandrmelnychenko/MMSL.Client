import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  Image,
  ScrollablePane,
  Label,
  PrimaryButton,
  CommandBarButton,
  Separator,
  FontWeights,
  IImageProps,
  Text,
} from 'office-ui-fabric-react';
import {
  scrollablePaneStyleForDetailList,
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import { IApplicationState } from '../../redux/reducers';
import { Measurement } from '../../interfaces';
import MeasurementSelector from './MeasurementSelector';
import MeasurementManagingPanel from './measurementManaging/MeasurementManagingPanel';
import {
  measurementActions,
  ManagingMeasurementPanelComponent,
} from '../../redux/slices/measurement.slice';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../redux/slices/control.slice';
import { assignPendingActions } from '../../helpers/action.helper';
import MeasurementChartGrid from './MeasurementChartGrid';
import NoMeasurementImg from '../../assets/images/no-objects/noneMeasurement.svg';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const dispatch = useDispatch();

  const targetMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

  const isMeasurementsWasRequested: boolean = useSelector<
    IApplicationState,
    boolean
  >((state) => state.measurements.isMeasurementsWasRequested);

  const isAnyMeasurements: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.measurements.measurementList.length > 0
  );

  useEffect(() => {
    return () => {};
  }, [dispatch]);

  const addMeasurement = () => {
    dispatch(
      measurementActions.changeManagingMeasurementPanelContent(
        ManagingMeasurementPanelComponent.CreateNewMeasurement
      )
    );
  };

  const mainContentHideableStyle =
    isMeasurementsWasRequested && isAnyMeasurements ? {} : { display: 'none' };

  const hintContentHideableStyle =
    isMeasurementsWasRequested && !isAnyMeasurements
      ? { height: '100%' }
      : { display: 'none' };

  const imageProps: Partial<IImageProps> = {
    styles: {
      root: {
        margin: '0 auto',
      },
    },
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
                  <MeasurementSelector />

                  <CommandBarButton
                    disabled={targetMeasurement ? false : true}
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
                      if (targetMeasurement) {
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
                        disabled={targetMeasurement ? false : true}
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
                          if (targetMeasurement) {
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
                        disabled={targetMeasurement ? false : true}
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
                          if (targetMeasurement) {
                            dispatch(
                              controlActions.toggleCommonDialogVisibility(
                                new DialogArgs(
                                  CommonDialogType.Delete,
                                  'Delete measurement',
                                  `Are you sure you want to delete ${targetMeasurement.name}?`,
                                  () => {
                                    dispatch(
                                      controlActions.closeInfoPanelWithComponent()
                                    );

                                    let action = assignPendingActions(
                                      measurementActions.apiDeleteMeasurementById(
                                        targetMeasurement.id
                                      ),
                                      [],
                                      [],
                                      (args: any) => {
                                        dispatch(
                                          measurementActions.changeSelectedMeasurement(
                                            null
                                          )
                                        );

                                        let action = assignPendingActions(
                                          measurementActions.apiGetAllMeasurements(),
                                          [],
                                          [],
                                          (args: any) => {
                                            dispatch(
                                              measurementActions.updateMeasurementsList(
                                                args
                                              )
                                            );

                                            let getNewMeasurementByIdAction = assignPendingActions(
                                              measurementActions.apiGetMeasurementById(
                                                args.length > 0 ? args[0].id : 0
                                              ),
                                              [],
                                              [],
                                              (args: any) => {
                                                dispatch(
                                                  measurementActions.changeSelectedMeasurement(
                                                    args
                                                  )
                                                );
                                              },
                                              (args: any) => {}
                                            );
                                            dispatch(
                                              getNewMeasurementByIdAction
                                            );
                                          }
                                        );

                                        dispatch(action);
                                      }
                                    );

                                    dispatch(action);
                                  },
                                  () => {}
                                )
                              )
                            );
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
              {targetMeasurement ? <MeasurementChartGrid /> : null}
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

      <MeasurementManagingPanel />
    </div>
  );
};

export default Measurements;
