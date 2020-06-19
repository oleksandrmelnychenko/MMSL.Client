import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../../../redux/reducers';
import { FittingType } from '../../../../../interfaces/fittingTypes';
import {
  DetailsList,
  ConstrainMode,
  Text,
  Selection,
  DetailsListLayoutMode,
  SelectionMode,
  CheckboxVisibility,
  DetailsRow,
  TooltipHost,
  IDetailsColumnRenderTooltipProps,
  IRenderFunction,
  IDetailsHeaderProps,
  IColumn,
  Stack,
  getId,
  IconButton,
} from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../../common/fabric-styles/styles';
import './fittingTypeGrid.scss';
import { List } from 'linq-typescript';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';

const FittingTypeGrid: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection({}));

  const fittingTypes: FittingType[] = useSelector<
    IApplicationState,
    FittingType[]
  >((state) => state.fittingTypes.fittingTypes);

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
                onClick: () => {
                  /// TODO:
                },
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                  dispatch(
                    assignPendingActions(
                      fittingTypesActions.apiDeleteFittingTypeById(item.id),
                      [],
                      [],
                      (args: any) => {
                        const fittingTypesList = new List(fittingTypes);
                        const removedFittingType = fittingTypesList.firstOrDefault(
                          (item) => item.id === args.body.id
                        );

                        if (removedFittingType) {
                          fittingTypesList.remove(removedFittingType);
                          dispatch(
                            fittingTypesActions.changeFittingTypes(
                              fittingTypesList.toArray()
                            )
                          );
                        }
                      },
                      (args: any) => {}
                    )
                  );
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

  const gridItems = fittingTypes.map((item: any) => {
    let result = { ...item };
    result.content = onRenderFrezeOptions(result);

    return result;
  });

  const columns = [
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
        return <Text style={defaultCellStyle}>{item.type}</Text>;
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
          <Text style={defaultCellStyle}>
            {item?.measurementUnit ? item.measurementUnit.description : ''}
          </Text>
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
