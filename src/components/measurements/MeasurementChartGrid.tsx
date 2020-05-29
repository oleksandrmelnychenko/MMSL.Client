import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DetailsList,
  Stack,
  IconButton,
  IColumn,
  CheckboxVisibility,
  Selection,
  IRenderFunction,
  IDetailsHeaderProps,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
  Text,
  Sticky,
  StickyPositionType,
  DetailsListLayoutMode,
  DetailsRow,
  ConstrainMode,
  SelectionMode,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../redux/reducers';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
} from '../../interfaces';
import { DATA_SELECTION_DISABLED_CLASS } from '../dealers/DealerList';
import './measurementChartGrid.scss';
import { List } from 'linq-typescript';
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
import { defaultCellStyle } from '../../common/fabric-styles/styles';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
    marginTop: '0px',
  },
};

const MeasurementChartGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());

  const targetMeasurementChart: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

  const selectedSizeId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >((state) => state.measurements.selectedSize?.id);

  useEffect(() => {
    return () => {};
  }, [dispatch]);

  let chartColumns: IColumn[] = [
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 70,
      isResizable: false,
      isCollapsible: false,
      data: 'string',
      onRender: (item: MeasurementMapSize) => {
        return (
          <Stack horizontal disableShrink>
            <IconButton
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Edit' }}
              title="Edit"
              ariaLabel="Edit"
              onClick={() => {
                dispatch(measurementActions.changeSizeForEdit(item));
                dispatch(
                  measurementActions.changeManagingMeasurementPanelContent(
                    ManagingMeasurementPanelComponent.EditChartSize
                  )
                );
              }}
            />
            <IconButton
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                if (item && item.measurementSize && targetMeasurementChart) {
                  dispatch(
                    controlActions.toggleCommonDialogVisibility(
                      new DialogArgs(
                        CommonDialogType.Delete,
                        'Delete size',
                        `Are you sure you want to delete ${item.measurementSize.name}?`,
                        () => {
                          if (
                            item &&
                            item.measurementSize &&
                            targetMeasurementChart
                          ) {
                            dispatch(
                              controlActions.closeInfoPanelWithComponent()
                            );
                            let action = assignPendingActions(
                              measurementActions.apiDeleteMeasurementSizeById({
                                measurementId: targetMeasurementChart.id,
                                sizeId: item.measurementSize.id,
                              }),
                              [],
                              [],
                              (args: any) => {
                                let getNewMeasurementByIdAction = assignPendingActions(
                                  measurementActions.apiGetMeasurementById(
                                    targetMeasurementChart
                                      ? targetMeasurementChart.id
                                      : 0
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
                                dispatch(getNewMeasurementByIdAction);
                              },
                              (args: any) => {}
                            );
                            dispatch(action);
                          }
                        },
                        () => {}
                      )
                    )
                  );
                }
              }}
            />
          </Stack>
        );
      },
      isPadded: true,
    },
  ];

  if (
    targetMeasurementChart &&
    targetMeasurementChart.measurementMapDefinitions
  ) {
    const dynamicChartColumns: any[] = new List(
      targetMeasurementChart.measurementMapDefinitions
    )
      .select((definitionMapItem: MeasurementMapDefinition) => {
        return {
          key: definitionMapItem.id,
          name: definitionMapItem.measurementDefinition.name,
          minWidth: 20,
          maxWidth: 50,
          isResizable: true,
          isCollapsible: false,
          data: 'string',
          isPadded: true,
          rawSourceContext: definitionMapItem,
          onRender: (
            item?: MeasurementMapSize,
            index?: number,
            column?: IColumn
          ) => {
            const cellValueStub = '-';
            let cellValue = cellValueStub;

            if (
              item &&
              item.measurementSize &&
              item.measurementSize.measurementMapValues &&
              column &&
              (column as any).rawSourceContext
            ) {
              const truthValue: any = new List(
                item.measurementSize.measurementMapValues
              ).firstOrDefault(
                (mapValueItem: any) =>
                  mapValueItem.measurementDefinitionId ===
                  (column as any).rawSourceContext.measurementDefinitionId
              );

              if (truthValue) {
                cellValue = truthValue.value;
              }
            }

            if (
              cellValue === '' ||
              cellValue === null ||
              cellValue === undefined
            )
              cellValue = cellValueStub;

            return <Text style={defaultCellStyle}>{cellValue}</Text>;
          },
        };
      })
      .toArray();

    const list = new List(dynamicChartColumns);
    list.insert(0, {
      key: 'sizeName',
      name: 'Size',
      minWidth: 20,
      maxWidth: 100,
      isResizable: true,
      isCollapsible: false,
      data: 'string',
      onRender: (
        item?: MeasurementMapSize,
        index?: number,
        column?: IColumn
      ) => {
        let cellValue = '-';

        if (item && item.measurementSize) {
          cellValue = item.measurementSize.name;
        }

        return <Text style={defaultCellStyle}>{`${cellValue}`}</Text>;
      },
      isPadded: true,
    });

    list.insert(0, {
      key: 'stubPadding',
      name: '',
      maxWidth: 1,
      minWidth: 1,
      isResizable: false,
      isCollapsable: false,
      data: 'string',
      onRender: (
        item?: MeasurementMapSize,
        index?: number,
        column?: IColumn
      ) => {
        return null;
      },
      isPadded: false,
    });

    chartColumns = list.concat(chartColumns).toArray();
  }
  if (chartColumns.length <= 1) chartColumns = [];

  const items =
    targetMeasurementChart && targetMeasurementChart.measurementMapSizes
      ? targetMeasurementChart.measurementMapSizes
      : [];

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = (
      tooltipHostProps
    ) => (
      <div className="list__header">
        <TooltipHost {...tooltipHostProps} />
      </div>
    );

    // <DetailsHeader
    //       styles={{
    //         root: { fontWeight: FontWeights.light },
    //         accessibleLabel: { fontWeight: FontWeights.light },
    //       }}
    //       {...props}
    //     />

    return (
      // <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
      //   {defaultRender!({
      //     ...props,
      //     onRenderColumnHeaderTooltip,
      //   })}
      // </Sticky>
      <div>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </div>
    );
  };

  return (
    <div
      className="measurementChartGrid"
      style={{
        position: 'relative',
        borderTop: '1px solid #dfdfdf',
        paddingTop: '16px',
      }}
    >
      <DetailsList
        onRenderDetailsHeader={onRenderDetailsHeader}
        styles={{
          root: {
            position: 'absolute',
            top: '16px',
            zIndex: 0,
            left: '0',
            overflowX: 'auto',
            width: '100%',
          },
        }}
        selection={selection}
        constrainMode={ConstrainMode.horizontalConstrained}
        isHeaderVisible={true}
        columns={chartColumns}
        layoutMode={DetailsListLayoutMode.justified}
        items={items}
        selectionMode={SelectionMode.single}
        // onRenderCheckbox={() => {
        //   return null;
        // }}
        checkboxVisibility={CheckboxVisibility.hidden}
        onRenderRow={(args: any) => {
          return (
            <div
            // onClick={(clickArgs: any) => {
            //   const offsetParent: any =
            //     clickArgs?.target?.offsetParent?.className;

            //   if (!offsetParent.includes(DATA_SELECTION_DISABLED_CLASS)) {
            //     const selectFlow = () => {
            //       dispatch(measurementActions.changeSelectedSize(args.item));
            //     };

            //     const unSelectFlow = () => {
            //       dispatch(measurementActions.changeSelectedSize(null));
            //     };

            //     if (selectedSizeId) {
            //       if (selectedSizeId === args.item.id) {
            //         unSelectFlow();
            //       } else {
            //         selectFlow();
            //       }
            //     } else {
            //       selectFlow();
            //     }
            //   }
            // }}
            >
              <DetailsRow {...args} />
            </div>
          );
        }}
      />

      {/* <div
        style={{
          position: 'absolute',
          top: '15px',
          left: '0px',
        }}
      >
        <Stack>
          <div style={{ height: '44px', width: '79px' }}></div>

          {items.map((item, index) => {
            const opacityValue = item.id === selectedSizeId ? 1 : 0;
            const pointerEvents = item.id === selectedSizeId ? 'auto' : 'none';

            return (
              <Stack
                horizontal
                disableShrink
                styles={{
                  root: {
                    // background: 'rgb(237, 235, 233)',
                    background: 'Red',
                    padding: '12px 6px 12px 9px',
                    // opacity: `${opacityValue}`,
                    // pointerEvents: `${pointerEvents}`,
                  },
                }}
              >
                <IconButton
                  data-selection-disabled={true}
                  className={DATA_SELECTION_DISABLED_CLASS}
                  styles={_columnIconButtonStyle}
                  height={20}
                  iconProps={{ iconName: 'Edit' }}
                  title="Edit"
                  ariaLabel="Edit"
                  onClick={() => {
                    if (item.id === selectedSizeId) {
                      dispatch(measurementActions.changeSizeForEdit(item));
                      dispatch(
                        measurementActions.changeManagingMeasurementPanelContent(
                          ManagingMeasurementPanelComponent.EditChartSize
                        )
                      );
                    }
                  }}
                />
                <IconButton
                  data-selection-disabled={true}
                  className={DATA_SELECTION_DISABLED_CLASS}
                  styles={_columnIconButtonStyle}
                  height={20}
                  iconProps={{ iconName: 'Delete' }}
                  title="Delete"
                  ariaLabel="Delete"
                  onClick={(args: any) => {
                    if (item.id === selectedSizeId) {
                      if (
                        item &&
                        item.measurementSize &&
                        targetMeasurementChart
                      ) {
                        dispatch(
                          controlActions.toggleCommonDialogVisibility(
                            new DialogArgs(
                              CommonDialogType.Delete,
                              'Delete size',
                              `Are you sure you want to delete ${item.measurementSize.name}?`,
                              () => {
                                if (
                                  item &&
                                  item.measurementSize &&
                                  targetMeasurementChart
                                ) {
                                  dispatch(
                                    controlActions.closeInfoPanelWithComponent()
                                  );

                                  let action = assignPendingActions(
                                    measurementActions.apiDeleteMeasurementSizeById(
                                      {
                                        measurementId:
                                          targetMeasurementChart.id,
                                        sizeId: item.measurementSize.id,
                                      }
                                    ),
                                    [],
                                    [],
                                    (args: any) => {
                                      let getNewMeasurementByIdAction = assignPendingActions(
                                        measurementActions.apiGetMeasurementById(
                                          targetMeasurementChart
                                            ? targetMeasurementChart.id
                                            : 0
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
                                      dispatch(getNewMeasurementByIdAction);
                                    },
                                    (args: any) => {}
                                  );

                                  dispatch(action);
                                }
                              },
                              () => {}
                            )
                          )
                        );
                      }
                    }
                  }}
                />
              </Stack>
            );
          })}
        </Stack>
      </div>
     */}
    </div>
  );
};

export default MeasurementChartGrid;
