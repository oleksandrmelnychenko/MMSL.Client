import React, { useState } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  Selection,
  IconButton,
  DetailsRow,
  ScrollablePane,
  IRenderFunction,
  IDetailsHeaderProps,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
  CheckboxVisibility,
  DetailsList,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import {
  detailsListStyle,
  defaultCellStyle,
  scrollablePaneStyleForDetailList,
} from '../../common/fabric-styles/styles';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { CustomerProductProfile } from '../../interfaces/orderProfile';
import {
  DialogArgs,
  CommonDialogType,
  controlActions,
} from '../../redux/slices/control.slice';
import { assignPendingActions } from '../../helpers/action.helper';
import { orderProfileActions } from '../../redux/slices/orderProfile/orderProfile.slice';
import { List } from 'linq-typescript';
import OrderProfileFormBootstrapper from './managing/orderProfile/OrderProfileFormBootstrapper';
import OrderMeasurementsFormBootstrapper from './managing/orderMeasurements/OrderMeasurementsFormBootstrapper';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export const OrderProfileList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection({}));

  const orderProfiles: CustomerProductProfile[] = useSelector<
    IApplicationState,
    CustomerProductProfile[]
  >((state) => state.orderProfile.orderProfiles);

  const targetOrderProfile:
    | CustomerProductProfile
    | null
    | undefined = useSelector<
    IApplicationState,
    CustomerProductProfile | null | undefined
  >((state) => state.orderProfile.targetOrderProfile);

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

  const onEditProfile = (profileToEdit: CustomerProductProfile) => {
    if (profileToEdit) {
      dispatch(
        assignPendingActions(
          orderProfileActions.apiGetOrderProfileById(profileToEdit.id),
          [],
          [],
          (args: any) => {
            dispatch(orderProfileActions.changeTargetOrderProfile(args));

            dispatch(
              controlActions.openRightPanel({
                title: 'Edit',
                description: `${profileToEdit.name}`,
                width: '400px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: OrderProfileFormBootstrapper,
              })
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const onConfigureMeasurement = (
    profileToConfigure: CustomerProductProfile
  ) => {
    if (profileToConfigure) {
      dispatch(
        assignPendingActions(
          orderProfileActions.apiGetOrderProfileById(profileToConfigure.id),
          [],
          [],
          (args: any) => {
            dispatch(orderProfileActions.changeTargetOrderProfile(args));

            dispatch(
              controlActions.openRightPanel({
                title: 'Measurement Details',
                description: `${profileToConfigure.name}`,
                width: '600px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: OrderMeasurementsFormBootstrapper,
              })
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const onDeleteProfile = (profileToDelete: CustomerProductProfile) => {
    if (profileToDelete) {
      dispatch(
        controlActions.toggleCommonDialogVisibility(
          new DialogArgs(
            CommonDialogType.Delete,
            'Delete order profile',
            `Are you sure you want to delete ${profileToDelete.name}?`,
            () => {
              if (profileToDelete) {
                dispatch(
                  assignPendingActions(
                    orderProfileActions.apiDeleteOrderProfileById(
                      profileToDelete.id
                    ),
                    [],
                    [],
                    (args: any) => {
                      dispatch(
                        orderProfileActions.changeOrderProfiles(
                          new List(orderProfiles)
                            .where(
                              (orderProfile) => orderProfile.id !== args.body.id
                            )
                            .toArray()
                        )
                      );
                      if (
                        targetOrderProfile &&
                        targetOrderProfile.id === args.body.id
                      )
                        dispatch(
                          orderProfileActions.changeTargetOrderProfile(null)
                        );
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

  const onRenderRow = (args: any) => {
    args.onRenderDetailsCheckbox = (props?: any, defaultRender?: any) => {
      return (
        <IconButton
          menuProps={{
            onDismiss: (ev) => {},
            items: [
              {
                key: 'edit',
                text: 'Edit',
                label: 'Edit',
                iconProps: { iconName: 'Edit' },
                onClick: () => onEditProfile(args?.item),
              },
              {
                key: 'measurementDetails',
                text: 'Measurement Details',
                label: 'Measurement Details',
                iconProps: { iconName: 'Table' },
                onClick: () => onConfigureMeasurement(args?.item),
              },
              {
                key: 'styleDetails',
                text: 'Style Details',
                label: 'Style Details',
                iconProps: { iconName: 'Settings' },
                onClick: () => {},
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => onDeleteProfile(args?.item),
              },
            ],
            styles: {
              root: { width: '174px' },
              container: { width: '174px' },
            },
          }}
          onRenderMenuIcon={(props?: any, defaultRender?: any) => null}
          iconProps={{ iconName: 'More' }}
          onMenuClick={(ev?: any) => {}}
        />
      );
    };
    return (
      <div onClick={(clickArgs: any) => {}}>
        <DetailsRow {...args} />
      </div>
    );
  };

  const columns: IColumn[] = [
    // {
    //   key: 'index',
    //   name: '',
    //   minWidth: 16,
    //   maxWidth: 24,
    //   onColumnClick: () => {},
    //   onRender: (item: any, index?: number) => {
    //     return (
    //       <Text
    //         style={defaultCellStyle}
    //         styles={{ root: { marginLeft: '6px' } }}
    //       >
    //         {index !== null && index !== undefined ? index + 1 : -1}
    //       </Text>
    //     );
    //   },
    // },
    {
      key: 'name',
      name: 'Name',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={defaultCellStyle}>{item.name}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'description',
      name: 'Description',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={defaultCellStyle}>{item.description}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'product',
      name: 'Product',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return (
          <Text style={defaultCellStyle}>{item.productCategory?.name}</Text>
        );
      },
      isPadded: true,
    },
    {
      key: 'customer',
      name: 'Customer',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return (
          <Text style={defaultCellStyle}>
            {item.storeCustomer?.customerName}
          </Text>
        );
      },
      isPadded: true,
    },
  ];

  return (
    <ScrollablePane styles={scrollablePaneStyleForDetailList}>
      <DetailsList
        onRenderDetailsHeader={onRenderDetailsHeader}
        styles={detailsListStyle}
        items={orderProfiles}
        checkboxVisibility={CheckboxVisibility.onHover}
        selection={selection}
        selectionMode={SelectionMode.single}
        columns={columns}
        onRenderRow={onRenderRow}
      />
    </ScrollablePane>
  );
};

export default OrderProfileList;
