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
  FontWeights,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../../../../redux/reducers';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
} from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import './productMeasurementChartGrid.scss';
import { List } from 'linq-typescript';
import {
  controlActions,
  CommonDialogType,
} from '../../../../../redux/slices/control.slice';
import { productActions } from '../../../../../redux/slices/product.slice';
import BaseSizeValueCell from './BaseSizeValueCell';
import BaseSizeNameCell from './BaseSizeNameCell';
import SizesForm from './management/SizesForm';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';
import BorderedCell from '../BorderedCell';

const FROZEN_COLUMN_WIDTH = 130;

const _addFirstSizeButtonStyle = {
  root: {
    marginTop: '72px',
    marginLeft: '32px',
    height: '35px',
    background: '#f0f0f0',
    borderRadius: '2px',
    padding: '0 12px',
  },
  label: {
    fontWeight: FontWeights.regular,
  },
  rootHovered: {
    background: '#e5e5e5',
  },
};

const ProductMeasurementChartGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection({}));

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
      return (
        <BorderedCell>
          <BaseSizeNameCell
            mapSize={item}
            measurementChart={targetProductMeasurementChart}
            productCategory={targetProduct}
          />
        </BorderedCell>
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
          height: '20px',
        }}
        ref={refference}
      >
        <IconButton
          styles={{ root: { position: 'absolute', top: '-6px', left: '-9px' } }}
          menuProps={{
            onDismiss: (ev) => {},
            items: [
              {
                key: 'edit',
                text: 'Edit',
                label: 'Edit',
                iconProps: { iconName: 'Edit' },
                onClick: () => {
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
                },
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                  if (
                    item &&
                    item.measurementSize &&
                    targetProductMeasurementChart &&
                    targetProduct
                  ) {
                    dispatch(
                      controlActions.toggleCommonDialogVisibility({
                        dialogType: CommonDialogType.Delete,
                        title: 'Delete size',
                        subText: `Are you sure you want to delete ${item.measurementSize.name}?`,
                        onSubmitClick: () => {
                          if (
                            item &&
                            item.measurementSize &&
                            targetProductMeasurementChart &&
                            targetProduct
                          ) {
                            dispatch(
                              assignPendingActions(
                                measurementActions.apiDeleteMeasurementSizeById(
                                  {
                                    measurementId:
                                      targetProductMeasurementChart.id,
                                    sizeId: item.measurementSize.id,
                                  }
                                ),
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
                        onDeclineClick: () => {},
                      })
                    );
                  }
                },
              },
            ],
            styles: {
              root: { width: '84px' },
              container: { width: '84px' },
            },
          }}
          onRenderMenuIcon={(props?: any, defaultRender?: any) => null}
          iconProps={{ iconName: 'More' }}
          onMenuClick={(ev?: any) => {}}
        />
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

    return (
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
      maxWidth: 26,
      minWidth: 26,
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
            isPadded: false,
            rawSourceContext: definitionMapItem,
            onRender: (
              item?: MeasurementMapSize,
              index?: number,
              column?: IColumn
            ) => {
              return (
                <BorderedCell>
                  <BaseSizeValueCell
                    mapSize={item}
                    chartColumn={(column as any).rawSourceContext}
                    measurementChart={targetProductMeasurementChart}
                    productCategory={targetProduct}
                  />
                </BorderedCell>
              );
            },
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
    <div className="productMeasurementChartGrid">
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
            width: '47px',
            borderRight: items && items.length < 1 ? '' : '1px solid #0078d415',
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
          styles={_addFirstSizeButtonStyle}
          iconProps={{ iconName: 'Add' }}
          text="Add first size"
        />
      ) : null}
    </div>
  );
};

export default ProductMeasurementChartGrid;
