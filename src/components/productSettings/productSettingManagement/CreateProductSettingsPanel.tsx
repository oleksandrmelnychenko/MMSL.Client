import React, { useState } from 'react';
import {
  ICommandBarItemProps,
  Panel,
  PanelType,
  CommandBar,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { FormicReference } from '../../../interfaces';
import {
  panelStyle,
  commandBarStyles,
  commandBarButtonStyles,
} from '../../../common/fabric-styles/styles';
import PanelTitle from '../../dealers/panel/PanelTitle';
import ManageProductSettingsForm from './ManageProductSettingsForm';
import * as customerActions from '../../../redux/actions/customer.actions';
import { assignPendingActions } from '../../../helpers/action.helper';

export const CreateProductSettingsPanel: React.FC = (props: any) => {
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
        isOpen={true}
        type={PanelType.custom}
        customWidth={'600px'}
        onDismiss={() => {
          dispatch(customerActions.toggleNewCustomerForm(false));
        }}
        closeButtonAriaLabel="Close"
      >
        <PanelTitle
          onSaveClick={() => {
            let formik: any = formikReference.formik;

            if (formik !== undefined && formik !== null) {
              formik.submitForm();
            }
          }}
          title={'New Product Setting'}
        />
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />

        <ManageProductSettingsForm
          formikReference={formikReference}
          submitAction={(args: any) => {
            debugger;
            // let createAction = assignPendingActions(
            //   customerActions.saveNewCustomer(args),
            //   [
            //     customerActions.getCustomersListPaginated(),
            //     customerActions.toggleNewCustomerForm(false),
            //   ]
            // );
            // dispatch(createAction);
          }}
        />
      </Panel>
    </div>
  );
};

export default CreateProductSettingsPanel;
