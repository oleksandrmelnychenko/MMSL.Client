import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  controlActions,
  IInfoPanelMenuItem,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { CUSTOMERS_PATH } from '../CustomersBootstrapper';
import CustomersOptionsPanel from './CustomersOptionsPanel';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers';
import { assignPendingActions } from '../../../helpers/action.helper';
import { orderProfileActions } from '../../../redux/slices/customer/orderProfile/orderProfile.slice';
import { StoreCustomer } from '../../../interfaces/storeCustomer';
import ManageProfileOptiosPanel, {
  onDismissManageProfileOptiosPanel,
} from './ManageProfileOptiosPanel';
import { profileManagingActions } from '../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { CustomerProductProfile } from '../../../interfaces/orderProfile';
import { customerActions } from '../../../redux/slices/customer/customer.slice';
import { ProductCategory } from '../../../interfaces/products';
import { List } from 'linq-typescript';
import { RoleType } from '../../../interfaces/identity';
import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';

export const onDismisActionsCustomerProfileOptiosPanel = () => {
  return [
    orderProfileActions.changeTargetOrderProfile(null),
    customerActions.updateSelectedCustomer(null),
  ];
};

const CustomerProfileOptiosPanel: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const targetOrderProfile:
    | CustomerProductProfile
    | null
    | undefined = useSelector<
    IApplicationState,
    CustomerProductProfile | null | undefined
  >((state) => state.orderProfile.targetOrderProfile);

  const selectedProductProfile:
    | ProductCategory
    | null
    | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.orderProfile.selectedProductProfiles);

  const selectedCustomer: StoreCustomer | null | undefined = useSelector<
    IApplicationState,
    StoreCustomer | null | undefined
  >((state) => state.customer.customerState.selectedCustomer);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      allowedRoles: [
        RoleType.Administrator,
        RoleType.Manufacturer,
        RoleType.Dealer,
      ],
      title: 'Back',
      className: 'management__btn-back_measurement',
      isDisabled: false,
      tooltip: 'Go back to customers',
      onClickFunc: () => {
        history.push(CUSTOMERS_PATH);
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: CustomersOptionsPanel,
            onDismisPendingAction: () => {},
          })
        );

        onDismisActionsCustomerProfileOptiosPanel().forEach((action) => {
          dispatch(action);
        });
      },
    },
    {
      allowedRoles: [RoleType.Dealer],
      title: 'New',
      className:
        selectedCustomer && selectedProductProfile
          ? 'management__btn-new_measurement'
          : 'management__btn-new_measurement management__btn-disabled',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Create new profile',
      onClickFunc: () => {
        if (selectedCustomer && selectedProductProfile) {
          dispatch(orderProfileActions.changeTargetOrderProfile(null));

          dispatch(
            controlActions.openInfoPanelWithComponent({
              component: ManageProfileOptiosPanel,
              onDismisPendingAction: () => {
                onDismissManageProfileOptiosPanel().forEach((action) =>
                  dispatch(action)
                );
              },
            })
          );

          dispatch(
            profileManagingActions.beginManaging({
              customer: selectedCustomer,
              productId: selectedProductProfile.id,
              profileForEdit: null,
            })
          );
        }
      },
    },
    {
      allowedRoles: [RoleType.Dealer],
      title: 'Edit',
      className:
        targetOrderProfile && selectedCustomer
          ? 'management__btn-edit_measurement'
          : 'management__btn-edit_measurement management__btn-disabled',
      isDisabled: targetOrderProfile && selectedCustomer ? false : true,
      tooltip: 'Details',
      onClickFunc: () => {
        if (targetOrderProfile && selectedCustomer) {
          dispatch(
            controlActions.openInfoPanelWithComponent({
              component: ManageProfileOptiosPanel,
              onDismisPendingAction: () => {
                onDismissManageProfileOptiosPanel().forEach((action) =>
                  dispatch(action)
                );
              },
            })
          );

          dispatch(
            profileManagingActions.beginManaging({
              customer: selectedCustomer,
              productId: targetOrderProfile.productCategoryId,
              profileForEdit: targetOrderProfile,
            })
          );

          dispatch(orderProfileActions.changeTargetOrderProfile(null));
        }
      },
    },
    {
      allowedRoles: [RoleType.Dealer],
      title: 'Delete',
      className:
        targetOrderProfile && selectedCustomer
          ? 'management__btn-delete_measurement'
          : 'management__btn-delete_measurement management__btn-disabled',
      isDisabled: targetOrderProfile && selectedCustomer ? false : true,
      tooltip: 'Delete profile',
      onClickFunc: () => {
        if (targetOrderProfile && selectedCustomer) {
          dispatch(
            controlActions.toggleCommonDialogVisibility(
              new DialogArgs(
                CommonDialogType.Delete,
                'Delete profile',
                `Are you sure you want to delete ${targetOrderProfile.name}?`,
                () => {
                  if (targetOrderProfile && selectedCustomer) {
                    dispatch(
                      assignPendingActions(
                        orderProfileActions.apiDeleteOrderProfileById(
                          targetOrderProfile.id
                        ),
                        [],
                        [],
                        (args: any) => {
                          dispatch(
                            assignPendingActions(
                              orderProfileActions.apiGetProductProfilesByCutomerId(
                                selectedCustomer.id
                              ),
                              [],
                              [],
                              (args: any) => {
                                dispatch(
                                  orderProfileActions.changeCustomerProductProfiles(
                                    args
                                  )
                                );

                                dispatch(
                                  orderProfileActions.changeSelectedProductProfiles(
                                    new List<ProductCategory>(
                                      args
                                    ).firstOrDefault(
                                      (product) =>
                                        product.id ===
                                        selectedProductProfile?.id
                                    )
                                  )
                                );
                              },
                              (args: any) => {}
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
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default CustomerProfileOptiosPanel;
