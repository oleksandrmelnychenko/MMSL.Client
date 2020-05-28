import React, { useState } from 'react';
import {
  ICommandBarItemProps,
  Panel,
  PanelType,
  CommandBar,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { FormicReference, StoreCustomer } from '../../../interfaces';
import {
  panelStyle,
  commandBarStyles,
  commandBarButtonStyles,
} from '../../../common/fabric-styles/styles';
import PanelTitle from '../../dealers/panel/PanelTitle';
import ManageCustomerForm from './ManageCustomerForm';
import { customerActions } from '../../../redux/slices/customer.slice';
import { assignPendingActions } from '../../../helpers/action.helper';

export const CustomerPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const isAddCustomerOpen = useSelector<IApplicationState, boolean>(
    (state) => state.customer.manageCustomerForm.isFormVisible
  );

  const selectedCustomer = useSelector<IApplicationState, StoreCustomer | null>(
    (state) => state.customer.customerState.selectedCustomer
  );

  const _items: ICommandBarItemProps[] = [
    {
      key: 'Save',
      text: 'Save',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Save' },
      onClick: () => {
        let formik: any = formikReference.formik;

        if (formik !== undefined && formik !== null) {
          formik.submitForm();
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Reset',
      text: 'Reset',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        formikReference.formik.resetForm();
      },
      buttonStyles: commandBarButtonStyles,
    },
  ];

  return (
    <div className="createDealerPanel">
      <Panel
        styles={panelStyle}
        isOpen={isAddCustomerOpen}
        type={PanelType.custom}
        customWidth={'600px'}
        onDismiss={() => {
          dispatch(customerActions.toggleCustomerForm(false));
        }}
        closeButtonAriaLabel="Close">
        <PanelTitle
          title={
            selectedCustomer
              ? `Customer: ${selectedCustomer.userName}`
              : `New Customer`
          }
        />
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />

        <ManageCustomerForm
          formikReference={formikReference}
          submitAction={(args: any) => {
            if (selectedCustomer) {
              dispatch(customerActions.updateStoreCustomer(args));
            } else {
              let createAction = assignPendingActions(
                customerActions.saveNewCustomer(args),
                [
                  customerActions.getCustomersListPaginated(),
                  customerActions.toggleCustomerForm(false),
                ]
              );
              dispatch(createAction);
            }
          }}
          customer={selectedCustomer ? selectedCustomer : null}
        />
      </Panel>
    </div>
  );
};

export default CustomerPanel;
