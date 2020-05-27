import React, { useEffect, useState } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  Selection,
  ScrollablePane,
  ShimmeredDetailsList,
  IDetailsHeaderProps,
  IRenderFunction,
  TooltipHost,
  Sticky,
  StickyPositionType,
  IDetailsColumnRenderTooltipProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { customerActions } from '../../redux/slices/customer.slice';
import { controlActions } from '../../redux/slices/control.slice';
import ManagementPanel from './options/ManagmentPanel';
import { CustomerListState } from '../../redux/slices/customer.slice';
import { FontWeights } from 'office-ui-fabric-react';
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
        if (selection.count > 0) {
          customerSelection();
        }
      },
    })
  );

  const { customersList, selectedCustomer } = useSelector<
    IApplicationState,
    CustomerListState
  >((state) => state.customer.customerState);

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    dispatch(customerActions.getCustomersListPaginated());
    return () => {
      dispatch(customerActions.selectedCustomer(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customersList.length > 0 && shimmer) {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [customersList, dispatch, shimmer]);

  useEffect(() => {
    if (!selectedCustomer) {
      selection.setAllSelected(false);
      dispatch(controlActions.closeInfoPanelWithComponent());
    }
  }, [selectedCustomer, selection, dispatch]);

  const customerSelection = () => {
    const selectedCustomer = selection.getSelection()[0] as any;
    dispatch(customerActions.selectedCustomer(selectedCustomer));
    dispatch(controlActions.openInfoPanelWithComponent(ManagementPanel));
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

  return (
    <div>
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <ShimmeredDetailsList
          onRenderDetailsHeader={onRenderDetailsHeader}
          enableShimmer={shimmer}
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
