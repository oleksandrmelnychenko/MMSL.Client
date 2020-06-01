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
  DetailsListLayoutMode,
  DetailsRow,
  ConstrainMode,
  SelectionMode,
  TextField,
  getId,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../redux/reducers';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
  MeasurementMapValue,
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
import { DefinitionValueItem } from './measurementManaging/SizesForm';
import ChartGridCell from './ChartGridCell';

// export class EditSizePayload {
//   constructor(
//     editedMapSize: MeasurementMapSize,
//     editValueItems: DefinitionValueItem[]
//   ) {
//     this.editedSizeMap = editedMapSize;
//     this.definitionValueItems = editValueItems;
//   }

//   editedSizeMap: MeasurementMapSize;
//   definitionValueItems: DefinitionValueItem[];
// }

export class EditSizePayload {
  constructor(
    editedMapSize: MeasurementMapSize,
    editValueItems: DefinitionValueItem
  ) {
    this.editedSizeMap = editedMapSize;
    this.definitionValueItems = editValueItems;
  }

  editedSizeMap: MeasurementMapSize;
  definitionValueItems: DefinitionValueItem;
}

const _columnIconButtonStyle = {
  root: {
    height: '20px',
    marginTop: '0px',
  },
};

const FROZEN_COLUMN_WIDTH = 130;

const MeasurementChartGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {},
    })
  );

  const [editedSizePayload, setEditedSizePayload] = useState<
    EditSizePayload | null | undefined
  >(null);

  const targetMeasurementChart: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

  useEffect(() => {
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    if (editedSizePayload) {
      document.addEventListener('click', (event: any) => {
        let targetId = `${event.target.id}`;

        if (targetId && targetId.includes('TextField')) {
          /// TODO: vadymk need to know that click was in the text field
          /// and prevent `stop editing`
        } else {
          if (targetId !== 'measurementChartGrid') setEditedSizePayload(null);
        }
      });
    } else {
      document.addEventListener('click', (event: any) => null);
    }
  }, [editedSizePayload]);

  const onRenderFrezeOptions = (item: any) => {
    const refference: any = React.createRef();
    item.customRef = refference;
    return (
      <div
        className="NOT_HOVER"
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
        }}
        ref={refference}>
        <Stack
          // styles={{
          //   root: {
          //     position: 'absolute',
          //     right: '0',
          //     top: '0',
          //   },
          // }}
          horizontal
          disableShrink>
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
      </div>
    );
  };

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

  const onRenderRow = (args: any) => {
    return (
      <div
        className="cell__grid"
        onMouseEnter={() => {
          if (args.item && args.item.content) {
            if (args.item.customRef.current) {
              args.item.customRef.current.className = 'HOVER';
            }

            args.item.isSelected = true;
          }
        }}
        onMouseLeave={() => {
          if (args.item && args.item.content) {
            if (args.item.customRef.current) {
              args.item.customRef.current.className = 'NOT_HOVER';
            }

            args.item.isSelected = false;
          }
        }}>
        <DetailsRow {...args} />
      </div>
    );
  };

  const onRenderPaddingStubColumn = () => {
    return {
      key: getId('stubPadding'),
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
    };
  };

  const findColumnSizeValue = (item?: MeasurementMapSize, column?: IColumn) => {
    let truthValue: MeasurementMapValue | null | undefined;

    if (
      item &&
      item.measurementSize &&
      item.measurementSize.measurementMapValues &&
      column &&
      (column as any).rawSourceContext
    ) {
      truthValue = new List(
        item.measurementSize.measurementMapValues
      ).firstOrDefault(
        (mapValueItem: any) =>
          mapValueItem.measurementDefinitionId ===
          (column as any).rawSourceContext.measurementDefinitionId
      );
    }

    return truthValue;
  };

  const onRenderDynamicSizeValueCell = (
    item?: MeasurementMapSize,
    index?: number,
    column?: IColumn
  ) => {
    // const cellValueStub = '-';
    // let cellValue = cellValueStub;
    // let renderResult = null;

    // if (item && column) {
    //   const truthValue:
    //     | MeasurementMapValue
    //     | null
    //     | undefined = findColumnSizeValue(item, column);

    //   if (truthValue) {
    //     cellValue = `${truthValue.value}`;
    //   }

    //   if (cellValue === '' || cellValue === null || cellValue === undefined)
    //     cellValue = cellValueStub;

    //   if (
    //     editedSizePayload?.editedSizeMap?.id === item.id &&
    //     (column as any).rawSourceContext.id ===
    //       editedSizePayload?.definitionValueItems?.sourceMapDefinition?.id
    //   ) {
    //     let inputValue = editedSizePayload.definitionValueItems.value;

    //     renderResult = (
    //       <TextField
    //         borderless
    //         type="number"
    //         value={inputValue}
    //         styles={{ root: { border: '1px solid black' } }}
    //         onChange={(args: any) => {
    //           if (editedSizePayload) {
    //             editedSizePayload.definitionValueItems.value =
    //               args.target.value;
    //             editedSizePayload.definitionValueItems.resolveIsDirty();

    //             const newSizePayload = { ...editedSizePayload };
    //             newSizePayload.definitionValueItems =
    //               editedSizePayload.definitionValueItems;

    //             setEditedSizePayload(newSizePayload);
    //           }
    //         }}
    //       />
    //     );
    //   } else {
    //     renderResult = (
    //       <Text
    //         onDoubleClick={() => {
    //           if (item && (column as any).rawSourceContext) {
    //             onBeginRowEdit(item, (column as any).rawSourceContext);
    //           }
    //         }}
    //         style={defaultCellStyle}
    //       >
    //         {cellValue}
    //       </Text>
    //     );
    //   }
    // }

    return (
      <ChartGridCell
        mapSize={item}
        chartColumn={(column as any).rawSourceContext}
        measurementChart={targetMeasurementChart}
      />
    );
  };

  const buildDynamicChartColumns = () => {
    if (
      targetMeasurementChart &&
      targetMeasurementChart.measurementMapDefinitions
    ) {
      const dynamicChartSizeColumns: any[] = new List(
        targetMeasurementChart.measurementMapDefinitions
      )
        .select((definitionMapItem: MeasurementMapDefinition) => {
          return {
            key: definitionMapItem.id,
            name: definitionMapItem.measurementDefinition.name,
            minWidth: 50,
            maxWidth: 70,
            isResizable: true,
            isCollapsible: false,
            data: 'string',
            isPadded: true,
            rawSourceContext: definitionMapItem,
            onRender: onRenderDynamicSizeValueCell,
          };
        })
        .toArray();

      const result = new List(dynamicChartSizeColumns);

      result.insert(0, {
        key: 'sizeName',
        name: 'Size',
        minWidth: FROZEN_COLUMN_WIDTH,
        maxWidth: FROZEN_COLUMN_WIDTH,
        isResizable: false,
        isCollapsible: false,
        isPadded: false,
        data: 'string',

        onRender: (item?: any, index?: number, column?: IColumn) => {
          let cellValue = '-';

          if (item && item.measurementSize) {
            cellValue = item.measurementSize.name;
          }

          return (
            <Stack
              styles={{ root: { position: 'relative' } }}
              horizontal
              horizontalAlign="space-between">
              <Stack.Item>
                <Text style={defaultCellStyle}>{`${cellValue}`}</Text>
              </Stack.Item>
              {item.content}
            </Stack>
          );
        },
      });
      result.insert(0, onRenderPaddingStubColumn());

      return result.toArray();
    }
  };

  const items =
    targetMeasurementChart && targetMeasurementChart.measurementMapSizes
      ? targetMeasurementChart.measurementMapSizes.map((item: any) => {
          item.content = onRenderFrezeOptions(item);
          return item;
        })
      : [];

  const columns = buildDynamicChartColumns();

  const onBeginRowEdit = (
    sizeItemRow: MeasurementMapSize,
    definition: MeasurementMapDefinition
  ) => {
    if (sizeItemRow && targetMeasurementChart) {
      let result: DefinitionValueItem | null | undefined = null;

      if (targetMeasurementChart?.measurementMapDefinitions) {
        result = new List(
          targetMeasurementChart.measurementMapDefinitions
            ? targetMeasurementChart.measurementMapDefinitions
            : []
        )
          .where((_) => _.id === definition.id)
          .select<DefinitionValueItem>(
            (mapDefinition: MeasurementMapDefinition) => {
              const resultItem = new DefinitionValueItem(mapDefinition);

              const targetDefinitionId = mapDefinition.measurementDefinitionId;

              if (sizeItemRow?.measurementSize?.measurementMapValues) {
                const targetMapValue:
                  | MeasurementMapValue
                  | null
                  | undefined = new List<MeasurementMapValue>(
                  sizeItemRow.measurementSize.measurementMapValues
                ).firstOrDefault(
                  (mapValueItem) =>
                    mapValueItem.measurementDefinitionId === targetDefinitionId
                );

                if (targetMapValue) {
                  resultItem.setMapValue(targetMapValue);
                }
              }

              return resultItem;
            }
          )
          .firstOrDefault();
      }

      if (result) {
        const editSizePayload = new EditSizePayload(sizeItemRow, result);
        setEditedSizePayload(editSizePayload);
      } else {
        // onEndSizeEdit();
      }
    } else {
      // onEndSizeEdit();
    }
  };

  const onEndSizeEdit = () => {
    if (
      targetMeasurementChart &&
      editedSizePayload &&
      editedSizePayload.editedSizeMap &&
      editedSizePayload.editedSizeMap.measurementSize &&
      editedSizePayload.definitionValueItems &&
      editedSizePayload.definitionValueItems.resolveIsDirty()
    ) {
      const sizePayload: any = {};

      sizePayload.id = editedSizePayload.editedSizeMap.measurementSizeId;
      sizePayload.name = editedSizePayload.editedSizeMap.measurementSize.name;
      sizePayload.description =
        editedSizePayload.editedSizeMap.measurementSize.description;
      sizePayload.measurementId = targetMeasurementChart.id;

      let value: any = parseFloat(editedSizePayload.definitionValueItems.value);

      if (isNaN(value)) {
        value = null;
      }

      sizePayload.valueDataContracts = [
        {
          id: editedSizePayload.definitionValueItems.getMapValueId(),
          value: value,
          measurementDefinitionId:
            editedSizePayload.definitionValueItems.sourceMapDefinition
              .measurementDefinitionId,
        },
      ];

      let action = assignPendingActions(
        measurementActions.apiUpdateMeasurementSize(sizePayload),
        [],
        [],
        (args: any) => {
          editedSizePayload.definitionValueItems.updateInitMapValue();
          setEditedSizePayload(null);
        },
        (args: any) => {}
      );

      dispatch(action);

      setEditedSizePayload(null);
    }
    setEditedSizePayload(null);
  };

  return (
    <div
      id="measurementChartGrid"
      className="measurementChartGrid"
      style={{
        position: 'relative',
        borderTop: '1px solid #dfdfdf',
        paddingTop: '16px',
      }}>
      {/* Main data grid with dynamic columns */}
      <DetailsList
        onRenderRow={onRenderRow}
        onRenderDetailsHeader={onRenderDetailsHeader}
        onActiveItemChanged={(item?: any, index?: number) => {
          if (
            editedSizePayload &&
            editedSizePayload.editedSizeMap.id !== item.id
          ) {
            // onEndSizeEdit();
          }
        }}
        onItemInvoked={(item?: any, index?: number, ev?: Event) => {
          // onBeginRowEdit(item);
        }}
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
        disableSelectionZone={false}
        selection={selection}
        constrainMode={ConstrainMode.horizontalConstrained}
        isHeaderVisible={true}
        layoutMode={DetailsListLayoutMode.justified}
        items={items}
        selectionMode={SelectionMode.single}
        checkboxVisibility={CheckboxVisibility.hidden}
        columns={columns}
      />

      {/* Grid for "frozen size name" column */}
      <DetailsList
        onRenderRow={onRenderRow}
        onRenderDetailsHeader={onRenderDetailsHeader}
        onActiveItemChanged={(item?: any, index?: number) => {
          if (
            editedSizePayload &&
            editedSizePayload.editedSizeMap.id !== item.id
          ) {
            // onEndSizeEdit();
          }
        }}
        onItemInvoked={(item?: any, index?: number, ev?: Event) => {
          // onBeginRowEdit(item);
        }}
        styles={{
          root: {
            position: 'absolute',
            top: '16px',
            zIndex: 0,
            left: '0',
            overflowX: 'auto',
            width: '171px',
          },
        }}
        selection={selection}
        constrainMode={ConstrainMode.horizontalConstrained}
        isHeaderVisible={true}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        items={items}
        selectionMode={SelectionMode.single}
        checkboxVisibility={CheckboxVisibility.hidden}
        columns={[
          onRenderPaddingStubColumn(),
          {
            key: 'sizeName',
            name: 'Size',
            minWidth: FROZEN_COLUMN_WIDTH,
            maxWidth: FROZEN_COLUMN_WIDTH,
            isResizable: false,
            isCollapsible: false,
            isPadded: false,
            data: 'string',

            onRender: (item?: any, index?: number, column?: IColumn) => {
              let cellValue = '-';

              if (item && item.measurementSize) {
                cellValue = item.measurementSize.name;
              }

              return (
                <Stack
                  styles={{ root: { position: 'relative' } }}
                  horizontal
                  horizontalAlign="space-between">
                  <Stack.Item>
                    <Text style={defaultCellStyle}>{`${cellValue}`}</Text>
                  </Stack.Item>
                  {item.content}
                </Stack>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default MeasurementChartGrid;
