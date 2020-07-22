import React from 'react';
import {
  customerActions,
  CustomerListState,
} from '../../../redux/slices/customer/customer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import {
  controlActions,
  IInfoPanelMenuItem,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { rightPanelActions } from '../../../redux/slices/rightPanel.slice';
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
import { RoleType } from '../../../interfaces/identity';
import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';

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
      allowedRoles: [
        RoleType.Administrator,
        RoleType.Manufacturer,
        RoleType.Dealer,
      ],
      title: 'Details',
      className: 'management__btn-detail',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Store customer details info',
      onClickFunc: () => {
        if (selectedCustomer) {
          dispatch(
            rightPanelActions.openRightPanel({
              title: `Customer: ${selectedCustomer!.customerName}`,
              width: '400px',
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
                dispatch(customerActions.updateSelectedCustomer(null));
              },
              component: ManageCustomerForm,
            })
          );
        }
      },
    },
    {
      allowedRoles: [RoleType.Dealer],
      title: 'Profiles',
      className: 'management__btn-styles',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Manage profiles',
      onClickFunc: () => {
        if (selectedCustomer) {
          dispatch(controlActions.closeInfoPanelWithComponent());

          dispatch(
            assignPendingActions(
              customerActions.apiGetCustomerById(selectedCustomer.id),
              [],
              [],
              (args: any) => {
                dispatch(customerActions.updateSelectedCustomer(args));
                history.push(`${CUSTOMER_PROFILES_PATH}${selectedCustomer.id}`);
                dispatch(
                  controlActions.openInfoPanelWithComponent({
                    component: CustomerProfileOptiosPanel,
                    onDismisPendingAction: () => {
                      history.push(CUSTOMERS_PATH);
                      onDismisActionsCustomerProfileOptiosPanel().forEach(
                        (action) => {
                          dispatch(action);
                        }
                      );
                    },
                  })
                );
              }
            )
          );
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(CUSTOMERS_PATH);
        }
      },
    },
    {
      allowedRoles: [
        RoleType.Administrator,
        RoleType.Manufacturer,
        RoleType.Dealer,
      ],
      title: 'Delete',
      className: selectedCustomer
        ? 'management__btn-delete_measurement'
        : 'management__btn-delete_measurement management__btn-disabled',
      isDisabled: selectedCustomer ? false : true,
      tooltip: 'Delete store customer',
      onClickFunc: () => {
        if (selectedCustomer) {
          dispatch(
            controlActions.toggleCommonDialogVisibility({
              dialogType: CommonDialogType.Delete,
              title: 'Delete customer',
              subText: `Are you sure you want to delete ${selectedCustomer.customerName}?`,
              onSubmitClick: () => {
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
                              .where((item) => item.id !== selectedCustomer.id)
                              .toArray()
                          )
                        );

                        dispatch(customerActions.updateSelectedCustomer(null));
                        dispatch(controlActions.closeInfoPanelWithComponent());
                      },
                      (args: any) => {}
                    )
                  );
                }
              },
              onDeclineClick: () => {},
            })
          );
        }
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default CustomersOptionsPanel;
