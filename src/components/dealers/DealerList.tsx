import React, { useEffect } from 'react';
import './dealerList.scss';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Stack,
  IconButton,
  Text,
  Selection,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import ReactPaginate from 'react-paginate';
import { DealerAccount, PaginationInfo } from '../../interfaces';
import DealersPagination from './DealersPagination';

export const DealerList: React.FC = () => {
  const dispatch = useDispatch();
  const dealers: DealerAccount[] = useSelector<
    IApplicationState,
    DealerAccount[]
  >((state) => state.dealer.dealerState.dealersList);

  useEffect(() => {
    dispatch(dealerActions.getDealersListPaginated());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumn[] = [
    {
      key: 'index',
      name: 'Sr.',
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
      key: 'dealerInfo',
      name: 'Dealer Info',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.companyName}</Text>;
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

  const dealerSelection = () => {
    const selectedDealer = selection.getSelection()[0] as DealerAccount;
    dispatch(dealerActions.setSelectedDealer(selectedDealer));
    dispatch(controlActions.isCollapseMenu(true));
    setTimeout(() => {
      dispatch(controlActions.isOpenPanelInfo(true));
    }, 500);
  };

  const dealerUnSelection = () => {
    dispatch(dealerActions.setSelectedDealer(new DealerAccount()));
    dispatch(controlActions.isCollapseMenu(false));
    dispatch(controlActions.isOpenPanelInfo(false));
  };

  const checkSelectionDealer = () => {
    if (selection.count > 0) {
      dealerSelection();
    } else {
      dealerUnSelection();
    }
  };

  const selection = new Selection({
    onSelectionChanged: () => {
      checkSelectionDealer();
    },
  });

  return (
    <div className="dealerList">
      <div className="dealerList__content">
        <DetailsList
          items={dealers}
          selection={selection}
          selectionMode={SelectionMode.single}
          columns={columns}
        />
      </div>
      <div className="dealerList__footer">
        <DealersPagination />
      </div>
    </div>
  );
};

export default DealerList;
