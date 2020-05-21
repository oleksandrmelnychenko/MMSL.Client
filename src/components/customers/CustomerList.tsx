import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Text,
  Selection,
  MarqueeSelection,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as customerActions from '../../redux/actions/customer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import ManagementPanel from './options/ManagmentPanel';
import { CustomerListState } from '../../redux/reducers/customer.reducer';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
} from '../../common/fabric-styles/styles';

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
];

export const CustomerList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        /// TODO: important
        if (selection.count > 0) {
          customerSelection();
        } else {
          // customerUnSelection();
        }
      },
    })
  );

  const { customersList, selectedCustomer } = useSelector<
    IApplicationState,
    CustomerListState
  >((state) => state.customer.customerState);

  useEffect(() => {
    if (!selectedCustomer) {
      selection.setAllSelected(false);
      dispatch(controlActions.closeInfoPanelWithComponent());
    }
  }, [selectedCustomer, selection, dispatch]);

  useEffect(() => {
    dispatch(customerActions.getCustomersListPaginated());
    return () => {
      dispatch(customerActions.selectedCustomer(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customerSelection = () => {
    const selectedCustomer = selection.getSelection()[0] as any;
    dispatch(customerActions.selectedCustomer(selectedCustomer));
    dispatch(controlActions.openInfoPanelWithComponent(ManagementPanel));
  };

  return (
    <div>
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <DetailsList
          styles={detailsListStyle}
          items={customersList}
          selection={selection}
          selectionMode={SelectionMode.single}
          columns={_customerColumns}
        />
      </ScrollablePane>
    </div>
  );
};

export default CustomerList;
