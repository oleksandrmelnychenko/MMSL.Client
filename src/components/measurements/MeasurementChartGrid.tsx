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

  const targetMeasurementChart: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

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
        ref={refference}
      >
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
        }}
      >
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

  const onRenderDynamicSizeValueCell = (
    item?: MeasurementMapSize,
    index?: number,
    column?: IColumn
  ) => {
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
              horizontalAlign="space-between"
            >
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

  return (
    <div
      id="measurementChartGrid"
      className="measurementChartGrid"
      style={{
        position: 'relative',
        borderTop: '1px solid #dfdfdf',
        paddingTop: '16px',
      }}
    >
      {/* Main data grid with dynamic columns */}
      <DetailsList
        onRenderRow={onRenderRow}
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
                  horizontalAlign="space-between"
                >
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
