import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../../../redux/reducers';
import { FittingType } from '../../../../../interfaces/measurements';
import {
  DetailsList,
  ConstrainMode,
  Text,
  Selection,
  DetailsListLayoutMode,
  SelectionMode,
  CheckboxVisibility,
  DetailsRow,
  IRenderFunction,
  IDetailsHeaderProps,
  IColumn,
  Stack,
  getId,
  IconButton,
  DetailsHeader,
} from 'office-ui-fabric-react';
import './fittingTypeGrid.scss';
import { List } from 'linq-typescript';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../../../redux/slices/control.slice';
import FittingTypeForm from './management/FittingTypeForm';
import {
  Measurement,
  MeasurementMapDefinition,
} from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import BodySizeValueCell from './BodySizeValueCell';
import BodySizeTypeCell from './BodySizeTypeCell';
import BodySizeUnitsCell from './BodySizeUnitsCell';
import BorderedCell from '../BorderedCell';

const FittingTypeGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection({}));

  const fittingTypes: FittingType[] = useSelector<
    IApplicationState,
    FittingType[]
  >((state) => state.fittingTypes.fittingTypes);

  const targetMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const targetProduct: ProductCategory | null | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.product.choose.category);

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

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props) {
      return null;
    }
    return (
      <DetailsHeader
        {...props}
        styles={{
          root: {
            paddingTop: '0px',
          },
        }}
      />
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
      onRender: (item?: FittingType, index?: number, column?: IColumn) => {
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
                onClick: () => onEdit(item),
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => onDelete(item),
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

  const buildDynamicChartColumns = () => {
    if (targetMeasurement?.measurementMapDefinitions) {
      const dynamicChartSizeColumns: any[] = new List(
        targetMeasurement.measurementMapDefinitions
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
              item?: FittingType,
              index?: number,
              column?: IColumn
            ) => {
              return (
                <BorderedCell>
                  <BodySizeValueCell
                    fittingType={item}
                    chartColumn={(column as any).rawSourceContext}
                    measurementChart={targetMeasurement}
                    productCategory={targetProduct}
                  />
                </BorderedCell>
              );
            },
          };
        })
        .toArray();

      const result = new List(dynamicChartSizeColumns);

      return result.toArray();
    }
  };

  const onEdit = (fittingTypeToEdit: FittingType) => {
    if (fittingTypeToEdit) {
      dispatch(
        assignPendingActions(
          fittingTypesActions.apiGetFittingTypeById(fittingTypeToEdit.id),
          [],
          [],
          (args: any) => {
            dispatch(fittingTypesActions.changeFittingTypeForEdit(args));

            dispatch(
              controlActions.openRightPanel({
                title: 'Edit',
                description: `${args.type}`,
                width: '400px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: FittingTypeForm,
              })
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const onDelete = (fittingTypeToDelete: FittingType) => {
    if (fittingTypeToDelete) {
      dispatch(
        controlActions.toggleCommonDialogVisibility(
          new DialogArgs(
            CommonDialogType.Delete,
            'Delete fitting type',
            `Are you sure you want to delete ${fittingTypeToDelete.type}?`,
            () => {
              if (fittingTypeToDelete) {
                dispatch(
                  assignPendingActions(
                    fittingTypesActions.apiDeleteFittingTypeById(
                      fittingTypeToDelete.id
                    ),
                    [],
                    [],
                    (args: any) => {
                      dispatch(
                        fittingTypesActions.changeFittingTypes(
                          new List(fittingTypes)
                            .where((item) => item.id !== args.body)
                            .toArray()
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
  };

  const gridItems = fittingTypes.map((item: any) => {
    let result = { ...item };
    result.content = onRenderFrezeOptions(result);

    return result;
  });

  const staticColumns = [
    onRenderPaddingStubColumn(),
    {
      key: 'type',
      name: 'Type',
      minWidth: 60,
      maxWidth: 120,
      isResizable: true,
      isCollapsible: false,
      data: 'string',
      isPadded: false,
      onRender: (item: any) => {
        return (
          <BorderedCell>
            <BodySizeTypeCell
              fittingType={item}
              measurementChart={targetMeasurement}
              productCategory={targetProduct}
            />
          </BorderedCell>
        );
      },
    },
    {
      key: 'unit',
      name: 'Unit',
      minWidth: 60,
      maxWidth: 120,
      isResizable: true,
      isCollapsible: false,
      data: 'string',
      isPadded: false,
      onRender: (item: any) => {
        return (
          <BorderedCell>
            <BodySizeUnitsCell
              fittingType={item}
              measurementChart={targetMeasurement}
              productCategory={targetProduct}
            />
          </BorderedCell>
        );
      },
    },
  ];

  return (
    <div className="fittingTypeGrid">
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
        items={gridItems}
        selectionMode={SelectionMode.single}
        checkboxVisibility={CheckboxVisibility.hidden}
        columns={new List(staticColumns)
          .concat(buildDynamicChartColumns() as [])
          .toArray()}
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
            borderRight:
              fittingTypes && fittingTypes.length < 1
                ? ''
                : '1px solid #0078d415',
          },
        }}
        selection={selection}
        constrainMode={ConstrainMode.horizontalConstrained}
        isHeaderVisible={true}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        items={gridItems}
        selectionMode={SelectionMode.single}
        checkboxVisibility={CheckboxVisibility.hidden}
        columns={[onRenderPaddingStubColumn()]}
      />
    </div>
  );
};

export default FittingTypeGrid;
