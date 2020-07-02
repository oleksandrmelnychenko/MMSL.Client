import React from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import {
  customerActions,
  CustomerListState,
} from '../../../redux/slices/customer/customer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import {
  controlActions,
  IInfoPanelMenuItem,
  CommonDialogType,
  DialogArgs,
} from '../../../redux/slices/control.slice';
import ManageCustomerForm from '../customerManaging/ManageCustomerForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';
import CustomerProfileOptiosPanel, {
  onDismisActionsCustomerProfileOptiosPanel,
} from './CustomerProfileOptiosPanel';
import {
  CUSTOMERS_PATH,
  CUSTOMER_PROFILES_PATH,
} from '../CustomersBootstrapper';
import { useHistory } from 'react-router-dom';

export const onDismisActionsCustomersOptionsPanel = () => {
  return [customerActions.updateSelectedCustomer(null)];
};

const CustomersOptionsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { customersList, selectedCustomer } = useSelector<
    IApplicationState,
    CustomerListState
  >((state) => state.customer.customerState);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Store customer details info',
      onClickFunc: () => {
        if (selectedCustomer) {
          dispatch(
            controlActions.openRightPanel({
              title: `Customer: ${selectedCustomer!.userName}`,
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
                dispatch(customerActions.updateSelectedCustomer(null));
              },
              component: ManageCustomerForm,
            })
          );
        }
      },
    },
    {
      title: 'Profiles',
      className: 'management__btn-styles',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Manage profiles',
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: CustomerProfileOptiosPanel,
            onDismisPendingAction: () => {
              history.push(CUSTOMERS_PATH);
              onDismisActionsCustomerProfileOptiosPanel().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (selectedCustomer) {
          history.push(`${CUSTOMER_PROFILES_PATH}${selectedCustomer.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(CUSTOMERS_PATH);
        }
      },
    },
    {
      title: 'Delete',
      className: selectedCustomer
        ? 'management__btn-delete_measurement'
        : 'management__btn-delete_measurement management__btn-disabled',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Delete store customer',
      onClickFunc: () => {
        if (selectedCustomer) {
          dispatch(
            controlActions.toggleCommonDialogVisibility(
              new DialogArgs(
                CommonDialogType.Delete,
                'Delete customer',
                `Are you sure you want to delete ${selectedCustomer.customerName}?`,
                () => {
                  if (selectedCustomer) {
                    dispatch(
                      assignPendingActions(
                        customerActions.apiDeleteCustomerById(
                          selectedCustomer.id
                        ),
                        [],
                        [],
                        (args: any) => {
                          dispatch(
                            customerActions.updateCustomersList(
                              new List(customersList)
                                .where(
                                  (item) => item.id !== selectedCustomer.id
                                )
                                .toArray()
                            )
                          );

                          dispatch(
                            customerActions.updateSelectedCustomer(null)
                          );
                          dispatch(
                            controlActions.closeInfoPanelWithComponent()
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

export default CustomersOptionsPanel;
