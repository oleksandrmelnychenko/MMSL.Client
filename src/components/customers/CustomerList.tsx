import './customerList.scss';
import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Text,
  Selection,
  MarqueeSelection,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as customerActions from '../../redux/actions/customer.actions';

import { StoreCustomer } from '../../interfaces';

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
    key: 'userName',
    name: 'User Name',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.userName}</Text>;
    },
    isPadded: true,
  },
  {
    key: 'email',
    name: 'Email',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.email}</Text>;
    },
    isPadded: true,
  },
  {
    key: 'customer',
    name: 'Customer Name',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.customerName}</Text>;
    },
    isPadded: true,
  },
  {
    key: 'store',
    name: 'Store',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text>{item.store ? item.store.name : ''}</Text>;
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

export const CustomerList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        /// TODO: important
        customerSelection();
        // if (selection.count > 0) {
        //   dealerSelection();
        // } else {
        //   dealerUnSelection();
        // }
      },
    })
  );

  const customers: StoreCustomer[] = useSelector<
    IApplicationState,
    StoreCustomer[]
  >((state) => state.customer.customerState.customersList);

  /// TODO: important
  //   const pagination: Pagination = useSelector<IApplicationState, Pagination>(
  //     (state) => state.dealer.dealerState.pagination
  //   );

  // const selectedCustomer: any = useSelector<
  //   IApplicationState,
  //   DealerAccount | null
  // >((state) => state.dealer.selectedDealer);

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

  useEffect(() => {
    dispatch(customerActions.getCustomersListPaginated());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// TODO: important
  const customerSelection = () => {
    const selectedDealer = selection.getSelection()[0] as any;
  };

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
          items={customers}
          selection={selection}
          selectionMode={SelectionMode.single}
          columns={_customerColumns}
        />
      </MarqueeSelection>
    </div>
  );
};

export default CustomerList;
