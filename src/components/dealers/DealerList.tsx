import './dealerList.scss';
import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Text,
  Selection,
  Stack,
  IconButton,
  MarqueeSelection,
  DetailsRow,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import { DealerAccount } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import * as controlAction from '../../redux/actions/control.actions';
import { ToggleDealerPanelWithDetails } from '../../redux/reducers/dealer.reducer';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

export const DealerList: React.FC = () => {
  const dispatch = useDispatch();
  const dealers: DealerAccount[] = useSelector<
    IApplicationState,
    DealerAccount[]
  >((state) => state.dealer.dealerState.dealersList);

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        if (selection.count > 0) {
          dealerSelection();
        } else {
          dealerUnSelection();
        }
      },
    })
  );

  const isCollapseMenu: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.control.isCollapseMenu
  );

  const selectedDealerId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >((state) => state.dealer.selectedDealer?.id);

  useEffect(() => {
    if (!isCollapseMenu) {
      selection.setAllSelected(false);
    }
  }, [isCollapseMenu, selection]);

  useEffect(() => {
    dispatch(dealerActions.getDealersListPaginated());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dealerSelection = () => {
    const selectedDealer = selection.getSelection()[0] as DealerAccount;

    let createAction = assignPendingActions(
      dealerActions.getAndSelectDealerById(selectedDealer.id),
      []
    );
    dispatch(controlActions.isCollapseMenu(true));
    setTimeout(() => {
      dispatch(controlActions.isOpenPanelInfo(true));
    }, 350);

    dispatch(createAction);
  };

  const dealerUnSelection = () => {
    debugger;
    dispatch(dealerActions.setSelectedDealer(null));
    dispatch(controlActions.isCollapseMenu(false));
    dispatch(controlActions.isOpenPanelInfo(false));
  };

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
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Copy' }}
              title="Copy"
              ariaLabel="Copy"
            />
            <IconButton
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'ShoppingCart' }}
            />
            <IconButton
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'People' }}
            />
            <IconButton
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Settings' }}
              title="Settings"
              ariaLabel="Settings"
            />
            <IconButton
              data-selection-disabled={true}
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                const actionsQueue: any[] = [
                  dealerActions.getDealersListPaginated(),
                ];

                if (item.id === selectedDealerId) {
                  debugger;
                  actionsQueue.push(dealerActions.setSelectedDealer(null));
                  actionsQueue.push(controlAction.isOpenPanelInfo(false));
                  actionsQueue.push(controlAction.isCollapseMenu(false));
                  actionsQueue.push(
                    dealerActions.isOpenPanelWithDealerDetails(
                      new ToggleDealerPanelWithDetails()
                    )
                  );
                }

                let action = assignPendingActions(
                  dealerActions.deleteDealerById(item.id),
                  actionsQueue
                );

                debugger;
                dispatch(action);
              }}
            />
          </Stack>
        );
      },
      isPadded: true,
    },
  ];

  return (
    <div className="dealerList">
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={dealers}
          selection={selection}
          selectionMode={SelectionMode.single}
          columns={_dealerColumns}
          // onRenderRow={(args: any) => {
          //   return (
          //     <div
          //       onClick={(clickArgs) => {
          //         let foo = args;
          //         debugger;
          //       }}
          //     >
          //       <DetailsRow
          //         eventsToRegister={{
          //           onMouseDown: (item?: any, index?: number, event?: any) => {
          //             debugger;
          //           },
          //         }}
          //         {...args}
          //       />
          //     </div>
          //   );
          // }}
        />
      </MarqueeSelection>
    </div>
  );
};

export default DealerList;
