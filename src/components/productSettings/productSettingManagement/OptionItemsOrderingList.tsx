import React, { useEffect, useState, Children } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Text,
  Selection,
  Stack,
  IconButton,
  MarqueeSelection,
  IDetailsHeaderProps,
  IRenderFunction,
  DetailsHeader,
  IDragDropContext,
  mergeStyles,
  getTheme,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import * as customerActions from '../../../redux/actions/customer.actions';
import * as controlActions from '../../../redux/actions/control.actions';
import { assignPendingActions } from '../../../helpers/action.helper';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../../redux/reducers/productSettings.reducer';
import {
  OptionGroup,
  OptionUnit,
  ModifiedOptionUnitOrder,
} from '../../../interfaces';
import { List } from 'linq-typescript';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

export const OptionItemsOrderingList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());
  const [draggedItem, setDraggedItem] = useState<
    OptionUnit | null | undefined
  >();
  const [draggedIndex, setDraggedIndex] = useState<number>(-1);

  const oputionUnits: OptionUnit[] = useSelector<
    IApplicationState,
    OptionUnit[]
  >((state) => state.productSettings.managingOptionUnitsState.optionUnits);

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  const dragEnterClass = mergeStyles({
    backgroundColor: getTheme().palette.neutralLight,
  });

  const customerColumns: IColumn[] = [
    {
      key: 'index',
      name: '#',
      minWidth: 16,
      maxWidth: 24,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return (
          <Text>{index !== null && index !== undefined ? index + 1 : -1}</Text>
        );
      },
    },
    {
      key: 'value',
      name: 'Value',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.value}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'isAllowed',
      name: 'Is Allowed',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.isAllowed}</Text>;
      },
      isPadded: true,
    },
    // {
    //   key: 'actions',
    //   name: 'Actions',
    //   minWidth: 70,
    //   isResizable: true,
    //   isCollapsible: true,
    //   data: 'string',
    //   onRender: (item: any) => {
    //     return (
    //       <Stack horizontal disableShrink>
    //         <IconButton
    //           styles={_columnIconButtonStyle}
    //           height={20}
    //           iconProps={{ iconName: 'Settings' }}
    //           title="Settings"
    //           ariaLabel="Settings"
    //           onClick={() => {
    //             dispatch(
    //               productSettingsActions.managingPanelContent(
    //                 ManagingPanelComponent.ManageUnits
    //               )
    //             );
    //           }}
    //         />
    //       </Stack>
    //     );
    //   },
    //   isPadded: true,
    // },
  ];

  const _insertBeforeItem = (item: any) => {
    const draggedItems = selection.isIndexSelected(draggedIndex)
      ? (selection.getSelection() as any[])
      : [draggedItem!];

    const insertIndex = oputionUnits.indexOf(item);
    const items = oputionUnits.filter(
      (itm) => draggedItems.indexOf(itm) === -1
    );

    items.splice(insertIndex, 0, ...draggedItems);

    items.forEach((item: OptionUnit, index: number) => {
      item.orderIndex = index;
    });

    let action = assignPendingActions(
      productSettingsActions.modifyOptionUnitsOrder(
        new List<OptionUnit>(items)
          .select<ModifiedOptionUnitOrder>((item: OptionUnit) => {
            let result = new ModifiedOptionUnitOrder();
            result.optionUnitId = item.id;
            result.orderIndex = item.orderIndex;

            return result;
          })
          .toArray()
      ),
      [productSettingsActions.getAllOptionGroupsList()]
    );
    dispatch(action);
  };

  return (
    <div>
      <MarqueeSelection selection={selection}>
        <DetailsList
          columns={customerColumns}
          items={oputionUnits}
          dragDropEvents={{
            canDrop: (
              dropContext?: IDragDropContext,
              dragContext?: IDragDropContext
            ) => {
              return true;
            },
            canDrag: (item?: any) => {
              return true;
            },
            onDragEnter: (item?: any, event?: DragEvent) => {
              // return string is the css classes that will be added to the entering element.
              return dragEnterClass;
            },
            onDragLeave: (item?: any, event?: DragEvent) => {
              return;
            },
            onDrop: (item?: any, event?: DragEvent) => {
              if (draggedItem) {
                _insertBeforeItem(item);
              }
            },
            onDragStart: (
              item?: any,
              itemIndex?: number,
              selectedItems?: any[],
              event?: MouseEvent
            ) => {
              setDraggedItem(item);
              setDraggedIndex(itemIndex!);
            },
            onDragEnd: (item?: any, event?: DragEvent) => {
              setDraggedItem(undefined);
              setDraggedIndex(-1);
            },
          }}
        />
      </MarqueeSelection>
    </div>
  );
};

export default OptionItemsOrderingList;
