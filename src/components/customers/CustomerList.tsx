import React, { useEffect, useState } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  Selection,
  ScrollablePane,
  IDetailsHeaderProps,
  IRenderFunction,
  TooltipHost,
  Sticky,
  StickyPositionType,
  IDetailsColumnRenderTooltipProps,
  DetailsList,
  DetailsRow,
  IconButton,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { customerActions } from '../../redux/slices/customer.slice';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../redux/slices/control.slice';
import ManagementPanel from './options/ManagmentPanel';
import { CustomerListState } from '../../redux/slices/customer.slice';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
  defaultCellStyle,
} from '../../common/fabric-styles/styles';
import { StoreCustomer } from '../../interfaces/storeCustomer';
import { assignPendingActions } from '../../helpers/action.helper';
import { List } from 'linq-typescript';

const _customerColumns: IColumn[] = [
  {
    key: 'index',
    name: '',
    minWidth: 16,
    maxWidth: 24,
    onColumnClick: () => {},
    onRender: (item: any, index?: number) => {
      return (
        <Text style={defaultCellStyle}>
          {index !== null && index !== undefined ? index + 1 : -1}
        </Text>
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
      return <Text style={defaultCellStyle}>{item.userName}</Text>;
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
      return <Text style={defaultCellStyle}>{item.email}</Text>;
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
      return <Text style={defaultCellStyle}>{item.customerName}</Text>;
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
      return (
        <Text style={defaultCellStyle}>
          {item.store ? item.store.name : ''}
        </Text>
      );
    },
    isPadded: true,
  },
];

export const CustomerList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());

  const { customersList, selectedCustomer } = useSelector<
    IApplicationState,
    CustomerListState
  >((state) => state.customer.customerState);

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    dispatch(customerActions.getCustomersListPaginated());
    return () => {
      dispatch(customerActions.selectedCustomer(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCustomer) {
      selection.setAllSelected(false);
      dispatch(controlActions.closeInfoPanelWithComponent());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer]);

  const onDeleteCustomer = (customerToDelete: StoreCustomer) => {
    if (customerToDelete) {
      dispatch(
        controlActions.toggleCommonDialogVisibility(
          new DialogArgs(
            CommonDialogType.Delete,
            'Delete customer',
            `Are you sure you want to delete ${customerToDelete.customerName}?`,
            () => {
              if (customerToDelete) {
                dispatch(
                  assignPendingActions(
                    customerActions.apiDeleteCustomerById(customerToDelete.id),
                    [],
                    [],
                    (args: any) => {
                      dispatch(
                        customerActions.updateCustomersList(
                          new List(customersList)
                            .where((item) => item.id !== customerToDelete.id)
                            .toArray()
                        )
                      );

                      dispatch(customerActions.selectedCustomer(null));
                      dispatch(controlActions.closeInfoPanelWithComponent());
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
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  const onRenderRow = (args: any) => {
    args.onRenderDetailsCheckbox = (props?: any, defaultRender?: any) => {
      return (
        <IconButton
          menuProps={{
            onDismiss: (ev) => {},
            items: [
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => onDeleteCustomer(args.item),
              },
            ],
            styles: {
              root: { width: '137px' },
              container: { width: '137px' },
            },
          }}
          onRenderMenuIcon={(props?: any, defaultRender?: any) => null}
          iconProps={{ iconName: 'More' }}
          onMenuClick={(ev?: any) => {}}
        />
      );
    };
    return (
      <div
        onClick={(clickArgs: any) => {
          const selectFlow = () => {
            dispatch(customerActions.selectedCustomer(args.item));
            dispatch(
              controlActions.openInfoPanelWithComponent({
                component: ManagementPanel,
                onDismisPendingAction: () => {},
              })
            );
          };

          if (selectedCustomer) {
            if (selectedCustomer.id !== args.item.id) {
              selectFlow();
            }
          } else {
            selectFlow();
          }
        }}
      >
        <DetailsRow {...args} />
      </div>
    );
  };

  return (
    <div>
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <DetailsList
          onRenderDetailsHeader={onRenderDetailsHeader}
          styles={detailsListStyle}
          items={customersList}
          selection={selection}
          selectionMode={SelectionMode.single}
          columns={_customerColumns}
          onRenderRow={onRenderRow}
        />
      </ScrollablePane>
    </div>
  );
};

export default CustomerList;
