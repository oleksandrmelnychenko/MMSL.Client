import React, { useEffect } from 'react';
import './dealerList.scss';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Stack,
  IconButton,
  Text,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { IDealer } from '../../interfaces';
import * as dealerActions from '../../redux/actions/dealer.actions';

export const DealerList: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const dealers = useSelector<IApplicationState, IDealer[]>(
    (state) => state.dealer.dealersList
  );

  useEffect(() => {
    dispatch(dealerActions.getDealersList());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumn[] = [
    {
      key: 'index',
      name: 'Sr.',
      minWidth: 16,
      maxWidth: 16,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return (
          <Text>{index !== null && index !== undefined ? index + 1 : -1}</Text>
        );
      },
    },
    {
      key: 'dealerInfo',
      name: 'Dealer Info',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.dealerInfo}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'rejected',
      name: 'Rejected',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.rejected}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'processing',
      name: 'Processing',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.processing}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'stitching',
      name: 'Stitching',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.stitching}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'stitched',
      name: 'Stitched',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.stitched}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'dispatched',
      name: 'Dispatched',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.dispatched}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'delivered',
      name: 'Delivered',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.delivered}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 70,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return (
          <Stack horizontal disableShrink>
            <IconButton
              iconProps={{ iconName: 'Copy' }}
              title="Copy"
              ariaLabel="Copy"
            />
            <IconButton iconProps={{ iconName: 'ShoppingCart' }} />
            <IconButton iconProps={{ iconName: 'People' }} />
            <IconButton
              iconProps={{ iconName: 'Settings' }}
              title="Settings"
              ariaLabel="Settings"
            />
          </Stack>
        );
      },
      isPadded: true,
    },
  ];

  return (
    <div className="dealerList">
      <DetailsList
        selectionMode={SelectionMode.none}
        items={dealers}
        columns={columns}
      />
    </div>
  );
};

export default DealerList;
