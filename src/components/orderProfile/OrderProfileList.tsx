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
          <Text style={defaultCellStyle}>
            {/* {item.productCategory?.name} */}
            {item.productCategoryId}
          </Text>
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
            {/* {item.storeCustomer?.customerName} */}
            {item.storeCustomerId}
          </Text>
        );
      },
      isPadded: true,
    },
  ];

  const onEditPermission = (permissionId: number | null | undefined) => {
    // if (permissionId && targetProduct) {
    //   dispatch(
    //     assignPendingActions(
    //       productStylePermissionsActions.apiGetPermissionById(permissionId),
    //       [],
    //       [],
    //       (args: any) => {
    //         dispatch(
    //           productStylePermissionsActions.changeEditingPermissionSetting(
    //             args
    //           )
    //         );
    //         dispatch(
    //           controlActions.openRightPanel({
    //             title: 'Edit style permission',
    //             description: args.name,
    //             width: '400px',
    //             closeFunctions: () => {
    //               dispatch(controlActions.closeRightPanel());
    //             },
    //             component: ProductPermissionForm,
    //           })
    //         );
    //       },
    //       (args: any) => {}
    //     )
    //   );
    // }
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
                onClick: () => onEditPermission(args?.item?.id),
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => onDeleteProfile(args.item),
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
      <div onClick={(clickArgs: any) => {}}>
        <DetailsRow {...args} />
      </div>
    );
  };

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
