import React from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import {
  customerActions,
  CustomerListState,
} from '../../../redux/slices/customer.slice';
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

export const onDismisActionsCustomersOptionsPanel = () => {
  return [customerActions.selectedCustomer(null)];
};

const CustomersOptionsPanel: React.FC = () => {
  const dispatch = useDispatch();

  const { customersList, selectedCustomer } = useSelector<
    IApplicationState,
    CustomerListState
  >((state) => state.customer.customerState);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      isDisabled: selectedCustomer ? false : true,
      tooltip: '',
      onClickFunc: () => {
        if (selectedCustomer) {
          dispatch(
            controlActions.openRightPanel({
              title: `Customer: ${selectedCustomer!.userName}`,
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
                dispatch(customerActions.selectedCustomer(null));
              },
              component: ManageCustomerForm,
            })
          );
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

                          dispatch(customerActions.selectedCustomer(null));
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
      ))}
    </div>
  );
};

export default CustomersOptionsPanel;
