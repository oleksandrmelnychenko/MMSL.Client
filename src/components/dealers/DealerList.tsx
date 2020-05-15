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
import { DealerAccount, Pagination } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';

const _dealerColumns: IColumn[] = [
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
    key: 'company',
    name: 'Company',
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
];

export const DealerList: React.FC = () => {
  const dispatch = useDispatch();
  const dealers: DealerAccount[] = useSelector<
    IApplicationState,
    DealerAccount[]
  >((state) => state.dealer.dealerState.dealersList);

  const pagination: Pagination = useSelector<IApplicationState, Pagination>(
    (state) => state.dealer.dealerState.pagination
  );

  useEffect(() => {
    // dispatch(dealerActions.getDealersListPaginated());
    dispatch(dealerActions.getDealersListPaginated());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dealerSelection = () => {
    const selectedDealer = selection.getSelection()[0] as DealerAccount;
    let createAction = assignPendingActions(
      dealerActions.getAndSelectDealerById(selectedDealer.id),
      []
    );
    /// TODO:
    dispatch(controlActions.isCollapseMenu(true));
    setTimeout(() => {
      dispatch(controlActions.isOpenPanelInfo(true));
    }, 500);

    dispatch(createAction);
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
      <DetailsList
        // styles={{ root: { display: 'none' } }}
        items={dealers}
        selection={selection}
        selectionMode={SelectionMode.single}
        columns={_dealerColumns}
      />
      {/* <DealersTable
        itemsSource={dealers}
        columns={columns}
        pageNumberSource={pagination.paginationInfo.pageNumber}
        invokeRequest={() => {
          let updatedPagination = { ...pagination };
          updatedPagination.paginationInfo = {
            ...pagination.paginationInfo,
          };
          updatedPagination.paginationInfo.pageNumber =
            updatedPagination.paginationInfo.pageNumber + 1;

          dispatch(dealerActions.updateDealerListPagination(updatedPagination));

          dispatch(
            assignPendingActions(dealerActions.getDealersListPaginated())
          );
        }}
      /> */}
      {/* <div className="dealerList__footer">
        <DealersPagination />
      </div> */}
    </div>
  );
};

export default DealerList;
