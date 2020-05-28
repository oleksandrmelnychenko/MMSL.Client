import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  ScrollablePane,
  ActionButton,
  Label,
  PrimaryButton,
  CommandBarButton,
  Separator,
  FontWeights,
} from 'office-ui-fabric-react';
import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';
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
import { List } from 'linq-typescript';

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

  return (
    <div className="content__root">
      <div className="content__header">
        <div className="content__header__top" style={mainContentHideableStyle}>
          <Stack className="measurement">
            <Stack horizontal tokens={{ childrenGap: 90 }}>
              <div className="content__header__top__title">Measurements</div>

              <Stack horizontal tokens={{ childrenGap: '6px' }}>
                <Stack horizontal tokens={{ childrenGap: '6px' }}>
                  <CommandBarButton
                    styles={{
                      root: {
                        height: '30px',
                        padding: '16px',
                      },
                    }}
                    onClick={() => addMeasurement()}
                    iconProps={{ iconName: 'Add' }}
                  >
                    Add measurement
                  </CommandBarButton>

                  <MeasurementSelector />
                </Stack>

                <Separator
                  vertical
                  // styles={{ root: { position: 'relative', left: '3px' } }}
                />
                <Stack horizontal tokens={{ childrenGap: '0px' }}>
                  <Stack horizontal>
                    <CommandBarButton
                      styles={{
                        root: {
                          height: '30px',
                          padding: '16px',
                        },
                        label: {
                          fontWeight: FontWeights.bold,
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
                    >
                      Edit
                    </CommandBarButton>

                    <CommandBarButton
                      disabled={targetMeasurement ? false : true}
                      styles={{
                        root: {
                          height: '30px',
                          padding: '16px',
                        },
                        label: {
                          fontWeight: FontWeights.bold,
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
                                          dispatch(
                                            measurementActions.changeSelectedMeasurement(
                                              new List<Measurement>(
                                                args
                                              ).firstOrDefault()
                                            )
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
                    >
                      Delete
                    </CommandBarButton>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>

      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <div style={mainContentHideableStyle}>
          {targetMeasurement ? `${targetMeasurement.name}` : null}
        </div>
        <ActionButton
          onClick={() => {
            dispatch(
              measurementActions.changeManagingMeasurementPanelContent(
                ManagingMeasurementPanelComponent.EditMeasurement
              )
            );
          }}
        >
          EDIT
        </ActionButton>
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

      <MeasurementManagingPanel />
    </div>
  );
};

export default Measurements;
