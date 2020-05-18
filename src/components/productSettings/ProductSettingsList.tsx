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
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as customerActions from '../../redux/actions/customer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import { DealerAccount, Pagination, StoreCustomer } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

const _customerColumns: IColumn[] = [
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
    key: 'name',
    name: 'Name',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.name}</Text>;
    },
    isPadded: true,
  },
  /// Temporary removed
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
  //           iconProps={{ iconName: 'Copy' }}
  //           title="Copy"
  //           ariaLabel="Copy"
  //         />
  //         <IconButton
  //           styles={_columnIconButtonStyle}
  //           height={20}
  //           iconProps={{ iconName: 'ShoppingCart' }}
  //         />
  //         <IconButton
  //           styles={_columnIconButtonStyle}
  //           height={20}
  //           iconProps={{ iconName: 'People' }}
  //         />
  //         <IconButton
  //           styles={_columnIconButtonStyle}
  //           height={20}
  //           iconProps={{ iconName: 'Settings' }}
  //           title="Settings"
  //           ariaLabel="Settings"
  //         />
  //       </Stack>
  //     );
  //   },
  //   isPadded: true,
  // },
];

export const ProductSettingsList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        /// TODO: important
        // if (selection.count > 0) {
        //   dealerSelection();
        // } else {
        //   dealerUnSelection();
        // }
      },
    })
  );
  const [items, setItems] = useState<any[]>([
    { key: 'a', name: 'a', color: 'red' },
    { key: 'b', name: 'b', color: 'red' },
    { key: 'c', name: 'c', color: 'blue' },
    { key: 'd', name: 'd', color: 'blue' },
    { key: 'e', name: 'e', color: 'blue' },
  ]);
  const [groups, setGroups] = useState<any[]>([
    {
      key: 'groupred0',
      name: 'Color: "red"',
      startIndex: 0,
      count: 4,
      level: 0,
    },
    {
      key: 'groupblue2',
      name: 'Color: "blue"',
      startIndex: 2,
      count: 3,
      level: 0,
    },
  ]);

  /// TODO: important
  //   const pagination: Pagination = useSelector<IApplicationState, Pagination>(
  //     (state) => state.dealer.dealerState.pagination
  //   );

  /// TODO: important
  //   const selectedDealer: any = useSelector<
  //     IApplicationState,
  //     DealerAccount | null
  //   >((state) => state.dealer.selectedDealer);

  /// TODO: important
  //   const isCollapseMenu: boolean = useSelector<IApplicationState, boolean>(
  //     (state) => state.control.isCollapseMenu
  //   );

  /// TODO: important
  //   useEffect(() => {
  //     if (!isCollapseMenu) {
  //       selection.setAllSelected(false);
  //     }
  //   }, [isCollapseMenu, selection]);

  /// TODO: important
  //   const dealerSelection = () => {
  //     const selectedDealer = selection.getSelection()[0] as DealerAccount;

  //     let createAction = assignPendingActions(
  //       dealerActions.getAndSelectDealerById(selectedDealer.id),
  //       []
  //     );
  //     dispatch(controlActions.isCollapseMenu(true));
  //     setTimeout(() => {
  //       dispatch(controlActions.isOpenPanelInfo(true));
  //     }, 350);

  //     dispatch(createAction);
  //   };

  /// TODO: important
  //   const dealerUnSelection = () => {
  //     dispatch(dealerActions.setSelectedDealer(null));
  //     dispatch(controlActions.isCollapseMenu(false));
  //     dispatch(controlActions.isOpenPanelInfo(false));
  //   };

  return (
    <div className="customerList">
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={items}
          groups={groups}
          groupProps={{
            showEmptyGroups: true,
          }}
          onRenderDetailsHeader={(props: any, _defaultRender?: any) => {
            debugger;
            return (
              <DetailsHeader
                {...props}
                ariaLabelForToggleAllGroupsButton={'Expand collapse groups'}
              />
            );
          }}
        />
      </MarqueeSelection>
    </div>
  );
};

export default ProductSettingsList;
