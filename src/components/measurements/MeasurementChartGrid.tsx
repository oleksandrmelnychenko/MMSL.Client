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
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../redux/reducers';
import { Measurement, MeasurementMapDefinition } from '../../interfaces';
import { DATA_SELECTION_DISABLED_CLASS } from '../dealers/DealerList';
import './measurementChartGrid.scss';
import { List } from 'linq-typescript';
import { firstCellStyle } from '../../common/fabric-styles/styles';
import {
  controlActions,
  CommonDialogType,
  DialogArgs,
} from '../../redux/slices/control.slice';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
    marginTop: '15px',
  },
};

const MeasurementChartGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());

  const targetMeasurementChart: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

  useEffect(() => {
    return () => {};
  }, [dispatch]);

  let chartColumns: IColumn[] = [
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 70,
      maxWidth: 130,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return (
          <Stack horizontal disableShrink>
            {/* <IconButton
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Edit' }}
              title="Edit"
              ariaLabel="Edit"
              onClick={() => {}}
            /> */}
            <IconButton
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                if (item && item.measurementSize) {
                  dispatch(
                    controlActions.toggleCommonDialogVisibility(
                      new DialogArgs(
                        CommonDialogType.Delete,
                        'Delete size',
                        `Are you sure you want to delete ${item.measurementSize.name}?`,
                        () => {
                          dispatch(
                            controlActions.closeInfoPanelWithComponent()
                          );
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
          isCollapsible: true,
          data: 'string',
          onRender: (item?: any, index?: number, column?: IColumn) => {
            let cellValue = '-';

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

            return <Text style={firstCellStyle}>{cellValue}</Text>;
          },
          isPadded: true,
          rawSourceContext: definitionMapItem,
        };
      })
      .toArray();

    const list = new List(dynamicChartColumns);
    list.insert(0, {
      key: 'sizeName',
      name: 'Size',
      minWidth: 20,
      maxWidth: 50,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item?: any, index?: number, column?: IColumn) => {
        let cellValue = '-';

        if (item && item.measurementSize) {
          cellValue = item.measurementSize.name;
        }

        return <Text style={firstCellStyle}>{`${cellValue}`}</Text>;
      },
      isPadded: true,
    });

    chartColumns = list.concat(chartColumns).toArray();
  }
  if (chartColumns.length <= 1) chartColumns = [];

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
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  return (
    <div
      className="measurementChartGrid"
      style={{ borderTop: '1px solid #dfdfdf' }}
    >
      <DetailsList
        onRenderDetailsHeader={onRenderDetailsHeader}
        styles={{ root: { overflowX: 'hidden' } }}
        selection={selection}
        isHeaderVisible={true}
        columns={chartColumns}
        layoutMode={DetailsListLayoutMode.justified}
        items={
          targetMeasurementChart && targetMeasurementChart.measurementMapSizes
            ? targetMeasurementChart.measurementMapSizes
            : []
        }
        checkboxVisibility={CheckboxVisibility.hidden}
        //   onRenderRow={(args: any) => {
        //     return (
        //       <div style={{ paddingLeft: '60px' }}>
        //         <DetailsRow
        //           styles={{
        //             root: {
        //               paddingLeft: '12px',
        //             },
        //           }}
        //           {...args}
        //         />
        //       </div>
        //     );
        //   }}
      />
    </div>
  );
};

export default MeasurementChartGrid;
