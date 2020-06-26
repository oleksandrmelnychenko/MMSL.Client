import React, { useEffect, useState } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  Selection,
  Stack,
  IconButton,
  DetailsRow,
  ScrollablePane,
  IRenderFunction,
  IDetailsHeaderProps,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
  FontIcon,
  mergeStyles,
  CheckboxVisibility,
  DetailsList,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { dealerActions } from '../../redux/slices/dealer.slice';
import { DealerAccount } from '../../interfaces/dealer';
import { assignPendingActions } from '../../helpers/action.helper';
import { controlActions } from '../../redux/slices/control.slice';
import { ToggleDealerPanelWithDetails } from '../../redux/slices/dealer.slice';
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';
import {
  detailsListStyle,
  columnIconButtonStyle,
  defaultCellStyle,
  scrollablePaneStyleForDetailList,
} from '../../common/fabric-styles/styles';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';
const USED_OWN_PASSWORD: string = 'Own password used';
const USED_OWN_PASSWORD_COLOR_HEX: string = '#a4373a80';

export const OrderProfileList: React.FC = () => {
  const dispatch = useDispatch();

  const dealers: DealerAccount[] = useSelector<
    IApplicationState,
    DealerAccount[]
  >((state) => state.dealer.dealerState.dealersList);

  const [selection] = useState(new Selection({}));

  const selectedDealerId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >((state) => state.dealer.selectedDealer?.id);

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  useEffect(() => {
    if (!selectedDealerId) {
      selection.setAllSelected(false);
    }
  }, [selectedDealerId, selection]);

  useEffect(() => {
    dispatch(dealerActions.apiGetDealersListPaginated());
    dispatch(controlActions.showGlobalShimmer());
    return () => {
      dispatch(dealerActions.getAndSelectDealerById(null));
      dispatch(controlActions.closeInfoPanelWithComponent());
    };
  }, [dispatch]);

  useEffect(() => {
    if (dealers.length > 0 && shimmer) {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [dealers, dispatch, shimmer]);

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

  const _dealerColumns: IColumn[] = [
    {
      key: 'index',
      name: '',
      minWidth: 16,
      maxWidth: 24,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return (
          <Text
            style={defaultCellStyle}
            styles={{ root: { marginLeft: '6px' } }}
          >
            {index !== null && index !== undefined ? index + 1 : -1}
          </Text>
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
        return <Text style={defaultCellStyle}>{item.name}</Text>;
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
      key: 'company',
      name: 'Company',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={defaultCellStyle}>{item.companyName}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'tempPassword',
      name: 'Temporay Password',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        let cellContent =
          item && item.tempPassword ? (
            item.tempPassword.length > 0 ? (
              <Text style={{ ...defaultCellStyle }} block nowrap>
                {item.tempPassword}
              </Text>
            ) : (
              <Stack horizontal>
                <FontIcon
                  style={{
                    cursor: 'default',
                    lineHeight: 1,
                    marginTop: '2px',
                    marginLeft: '-4px',
                  }}
                  iconName="RadioBullet"
                  className={mergeStyles({
                    fontSize: 16,
                    color: USED_OWN_PASSWORD_COLOR_HEX,
                  })}
                />

                <Text block nowrap>
                  {USED_OWN_PASSWORD}
                </Text>
              </Stack>
            )
          ) : (
            ''
          );

        return cellContent;
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
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                dispatch(
                  controlActions.toggleCommonDialogVisibility(
                    new DialogArgs(
                      CommonDialogType.Delete,
                      'Delete dealer',
                      `Are you sure you want to delete ${item.name}?`,
                      () => {
                        const actionsQueue: any[] = [
                          dealerActions.apiGetDealersListPaginated(),
                        ];
                        /// TODO:
                        if (item.id) {
                          actionsQueue.push(
                            dealerActions.setSelectedDealer(null),
                            controlActions.closeInfoPanelWithComponent(),
                            dealerActions.isOpenPanelWithDealerDetails(
                              new ToggleDealerPanelWithDetails()
                            )
                          );
                        }
                        let action = assignPendingActions(
                          dealerActions.deleteDealerById(item.id),
                          actionsQueue
                        );
                        dispatch(action);
                      },
                      () => {}
                    )
                  )
                );
              }}
            />
          </Stack>
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

  const onDeleteCustomer = (customerToDelete: any) => {
    if (customerToDelete) {
      //   dispatch(
      //     controlActions.toggleCommonDialogVisibility(
      //       new DialogArgs(
      //         CommonDialogType.Delete,
      //         'Delete customer',
      //         `Are you sure you want to delete ${customerToDelete.customerName}?`,
      //         () => {
      //           if (customerToDelete) {
      //             dispatch(
      //               assignPendingActions(
      //                 customerActions.apiDeleteCustomerById(customerToDelete.id),
      //                 [],
      //                 [],
      //                 (args: any) => {
      //                   dispatch(
      //                     customerActions.updateCustomersList(
      //                       new List(customersList)
      //                         .where((item) => item.id !== customerToDelete.id)
      //                         .toArray()
      //                     )
      //                   );
      //                   dispatch(customerActions.selectedCustomer(null));
      //                   dispatch(controlActions.closeInfoPanelWithComponent());
      //                 },
      //                 (args: any) => {}
      //               )
      //             );
      //           }
      //         },
      //         () => {}
      //       )
      //     )
      //   );
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
        items={dealers}
        checkboxVisibility={CheckboxVisibility.hidden}
        selection={selection}
        selectionMode={SelectionMode.single}
        columns={_dealerColumns}
        onRenderRow={onRenderRow}
      />
    </ScrollablePane>
  );
};

export default OrderProfileList;
