import React from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
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

export const onDismisActionsCustomerProfileOptiosPanel = () => {
  return [orderProfileActions.changeTargetOrderProfile(null)];
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

  const selectedCustomer: StoreCustomer | null | undefined = useSelector<
    IApplicationState,
    StoreCustomer | null | undefined
  >((state) => state.customer.customerState.selectedCustomer);

  const menuItem: IInfoPanelMenuItem[] = [
    {
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

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <TooltipHost
          key={index}
          id={`{${index}__optionTooltip}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.rightCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={(item as any).tooltip}
        >
          <Label
            key={index}
            styles={labelStyle}
            className={false ? 'selected' : ''}
          >
            <PrimaryButton
              styles={btnMenuStyle}
              className={item.className}
              onClick={() => item.onClickFunc()}
              allowDisabledFocus
            />
            {item.title}
          </Label>
        </TooltipHost>
      ))}
    </div>
  );
};

export default CustomerProfileOptiosPanel;
