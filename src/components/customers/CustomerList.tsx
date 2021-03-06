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
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { customerActions } from '../../redux/slices/customer/customer.slice';
import { infoPanelActions } from '../../redux/slices/infoPanel.slice';
import CustomersOptionsPanel, {
  onDismisActionsCustomersOptionsPanel,
} from './options/CustomersOptionsPanel';
import { CustomerListState } from '../../redux/slices/customer/customer.slice';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
  defaultCellStyle,
} from '../../common/fabric-styles/styles';
import { dateToFormatedString } from '../../helpers/date.helper';

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
    key: 'customerId',
    name: 'Customer ID',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text style={defaultCellStyle}>{item.uniqueId}</Text>;
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
  {
    key: 'phoneNumber',
    name: 'Phone Number',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text style={defaultCellStyle}>{item.phoneNumber}</Text>;
    },
    isPadded: true,
  },
  {
    key: 'birthDate',
    name: 'Birth Date',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return (
        <Text style={defaultCellStyle}>
          {dateToFormatedString(item.birthDate)}
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
    dispatch(customerActions.getCustomersListPaginated());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCustomer) {
      selection.setAllSelected(false);
      dispatch(infoPanelActions.closeInfoPanelWithComponent());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer]);

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
    return (
      <div
        onClick={(clickArgs: any) => {
          const selectFlow = () => {
            dispatch(customerActions.updateSelectedCustomer(args.item));
            dispatch(
              infoPanelActions.openInfoPanelWithComponent({
                component: CustomersOptionsPanel,
                onDismisPendingAction: () =>
                  onDismisActionsCustomersOptionsPanel().forEach((action) => {
                    dispatch(action);
                  }),
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
          selectionPreservedOnEmptyClick
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
