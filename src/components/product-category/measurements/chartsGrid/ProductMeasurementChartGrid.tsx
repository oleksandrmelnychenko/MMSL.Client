import React, { useState } from 'react';
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
  getId,
  CommandBarButton,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../../../redux/reducers';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
  ProductCategory,
} from '../../../../interfaces';
import { DATA_SELECTION_DISABLED_CLASS } from '../../../dealers/DealerList';
import './productMeasurementChartGrid.scss';
import { List } from 'linq-typescript';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../../redux/slices/control.slice';
import { productActions } from '../../../../redux/slices/product.slice';
import { defaultCellStyle } from '../../../../common/fabric-styles/styles';
import ProductChartGridCell from './ProductChartGridCell';
import ProductChartNameGridCell from './ProductChartNameGridCell';
import SizesForm from '../management/SizesForm';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { measurementActions } from '../../../../redux/slices/measurement.slice';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
    marginTop: '0px',
  },
};

const FROZEN_COLUMN_WIDTH = 130;

const ProductMeasurementChartGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {},
    })
  );

  const targetProductMeasurementChart:
    | Measurement
    | null
    | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const targetProduct: ProductCategory | null | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.product.choose.category);

  const sizeNameColumn = {
    key: 'sizeName',
    name: 'Size',
    minWidth: 50,
    maxWidth: FROZEN_COLUMN_WIDTH,
    isResizable: true,
    isCollapsible: false,
    isPadded: false,
    data: 'string',

    onRender: (item?: any, index?: number, column?: IColumn) => {
      // let cellValue = '-';

      // if (item && item.measurementSize) {
      //   cellValue = item.measurementSize.name;
      // }

      // return (
      //   <Stack
      //     styles={{ root: { position: 'relative' } }}
      //     horizontal
      //     horizontalAlign="space-between"
      //   >
      //     <Text nowrap block style={defaultCellStyle}>{`${cellValue}`}</Text>
      //   </Stack>
      // );
      return (
        <ProductChartNameGridCell
          mapSize={item}
          measurementChart={targetProductMeasurementChart}
          productCategory={targetProduct}
        />
      );
    },
  };

  const onRenderFrezeOptions = (item: any) => {
    const refference: any = React.createRef();
    item.customRef = refference;
    return (
      <div
        className="NOT_HOVER"
        style={{
          position: 'relative',
          right: '0',
          top: '0',
        }}
        ref={refference}
      >
        <Stack
          styles={{ root: { marginLeft: '-12px' } }}
          horizontal
          disableShrink
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
              if (targetProductMeasurementChart) {
                dispatch(
                  assignPendingActions(
                    measurementActions.apiGetMeasurementById(
                      targetProductMeasurementChart.id
                    ),
                    [],
                    [],
                    (args: any) => {
                      /// Extract `fresh` size for edit
                      const sizeForEdit: any = new List(
                        args.measurementMapSizes
                      ).firstOrDefault(
                        (sizeItem: any) => sizeItem.id === item.id
                      );

                      if (sizeForEdit) {
                        dispatch(
                          productActions.changeProductMeasurementSizeForEdit(
                            sizeForEdit
                          )
                        );

                        dispatch(
                          controlActions.openRightPanel({
                            title: 'Edit size',
                            description: item.name,
                            width: '400px',
                            closeFunctions: () => {
                              dispatch(
                                productActions.changeProductMeasurementSizeForEdit(
                                  null
                                )
                              );
                              dispatch(controlActions.closeRightPanel());
                            },
                            component: SizesForm,
                          })
                        );
                      }
                    },
                    (args: any) => {}
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
              if (
                item &&
                item.measurementSize &&
                targetProductMeasurementChart &&
                targetProduct
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
                          targetProductMeasurementChart &&
                          targetProduct
                        ) {
                          dispatch(
                            assignPendingActions(
                              measurementActions.apiDeleteMeasurementSizeById({
                                measurementId: targetProductMeasurementChart.id,
                                sizeId: item.measurementSize.id,
                              }),
                              [],
                              [],
                              (args: any) => {
                                dispatch(
                                  assignPendingActions(
                                    measurementActions.apiGetMeasurementById(
                                      targetProductMeasurementChart
                                        ? targetProductMeasurementChart.id
                                        : 0
                                    ),
                                    [],
                                    [],
                                    (args: any) => {
                                      dispatch(
                                        productActions.changeSelectedProductMeasurement(
                                          args
                                        )
                                      );
                                    },
                                    (args: any) => {}
                                  )
                                );
                              },
                              (args: any) => {}
                            )
                          );
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
      maxWidth: 50,
      minWidth: 50,
      isResizable: false,
      isCollapsable: false,
      data: 'string',
      onRender: (
        item?: MeasurementMapSize,
        index?: number,
        column?: IColumn
      ) => {
        return (
          <Stack horizontal>
            <Text block styles={{ root: { color: '#ffffff00' } }}>
              .
            </Text>
            {(item as any)?.content}
          </Stack>
        );
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
      <ProductChartGridCell
        mapSize={item}
        chartColumn={(column as any).rawSourceContext}
        measurementChart={targetProductMeasurementChart}
        productCategory={targetProduct}
      />
    );
  };

  const buildDynamicChartColumns = () => {
    if (
      targetProduct &&
      targetProductMeasurementChart &&
      targetProductMeasurementChart.measurementMapDefinitions
    ) {
      const dynamicChartSizeColumns: any[] = new List(
        targetProductMeasurementChart.measurementMapDefinitions
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
            // defaultCellStyle:{{root:""}},
            isPadded: false,
            rawSourceContext: definitionMapItem,
            onRender: onRenderDynamicSizeValueCell,
          };
        })
        .toArray();

      const result = new List(dynamicChartSizeColumns);

      result.insert(0, sizeNameColumn);
      result.insert(0, onRenderPaddingStubColumn());

      return result.toArray();
    }
  };

  const addNewSize = () => {
    if (targetProductMeasurementChart) {
      dispatch(
        controlActions.openRightPanel({
          title: 'Add size',
          description: targetProductMeasurementChart.name,
          width: '400px',
          closeFunctions: () => {
            dispatch(controlActions.closeRightPanel());
          },
          component: SizesForm,
        })
      );
    }
  };

  const items =
    targetProduct &&
    targetProductMeasurementChart &&
    targetProductMeasurementChart.measurementMapSizes
      ? targetProductMeasurementChart.measurementMapSizes.map((item: any) => {
          item.content = onRenderFrezeOptions(item);
          return item;
        })
      : [];

  const columns = buildDynamicChartColumns();

  return (
    <div
      className="productMeasurementChartGrid"
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
            width: '71px',
            borderRight:
              items && items.length < 1 ? '' : '1px solid rgb(223, 223, 223)',
          },
        }}
        selection={selection}
        constrainMode={ConstrainMode.horizontalConstrained}
        isHeaderVisible={true}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        items={items}
        selectionMode={SelectionMode.single}
        checkboxVisibility={CheckboxVisibility.hidden}
        columns={[onRenderPaddingStubColumn()]}
      />

      {items && items.length < 1 ? (
        <CommandBarButton
          disabled={targetProductMeasurementChart ? false : true}
          onClick={() => addNewSize()}
          height={20}
          styles={{
            root: {
              marginTop: '72px',
              marginLeft: '32px',
              height: '35px',
              background: '#f0f0f0',
              borderRadius: '2px',
              padding: '0 12px',
            },
            label: {
              fontWeight: '400',
            },
            rootHovered: {
              background: '#e5e5e5',
            },
          }}
          iconProps={{ iconName: 'Add' }}
          text="Add first size"
        />
      ) : null}
    </div>
  );
};

export default ProductMeasurementChartGrid;
