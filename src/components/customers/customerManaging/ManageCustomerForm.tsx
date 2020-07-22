import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Stack, IComboBoxOption } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../interfaces';
import { Address } from '../../../interfaces/addresses';
import { IStore } from '../../../interfaces/store';
import { StoreCustomer } from '../../../interfaces/storeCustomer';
import { useDispatch, useSelector } from 'react-redux';
import { customerActions } from '../../../redux/slices/customer/customer.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../helpers/commandBar.helper';
import { rightPanelActions } from '../../../redux/slices/rightPanel.slice';
import { IApplicationState } from '../../../redux/reducers/index';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';
import Entry from '../../../common/formFields/Entry';
import MaskedEntry from '../../../common/formFields/MaskedEntry';
import FormComboBox from '../../../common/formFields/FormComboBox';
import FormDatePicker from '../../../common/formFields/FormDatePicker';

interface IFormValues {
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  store: IStore | null;
}

const buildCustomerAccountData = (
  values: IFormValues,
  sourceEntity?: StoreCustomer
) => {
  let newAccount: StoreCustomer;

  if (sourceEntity) {
    newAccount = { ...sourceEntity };
  } else {
    newAccount = new StoreCustomer();
    newAccount.billingAddress = new Address();
    newAccount.billingAddressId = newAccount.billingAddress.id;
    newAccount.deliveryAddress = new Address();
    newAccount.deliveryAddressId = newAccount.deliveryAddress.id;
  }

  newAccount.userName = values.customerName;
  newAccount.customerName = values.customerName;
  newAccount.email = values.email;
  newAccount.phoneNumber = values.phoneNumber;
  newAccount.birthDate =
    values.birthDate && values.birthDate.length > 0 ? values.birthDate : null;
  newAccount.store = values.store;
  newAccount.storeId = newAccount.store?.id;

  return newAccount;
};

const initDefaultValuesForNewStoreCustomerForm = (
  sourceEntity?: StoreCustomer | null
) => {
  const initValues: IFormValues = {
    customerName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    store: null,
  };

  if (sourceEntity) {
    initValues.customerName = sourceEntity.customerName;
    initValues.email = sourceEntity.email;
    initValues.phoneNumber = sourceEntity.phoneNumber;
    initValues.birthDate = sourceEntity.birthDate ? sourceEntity.birthDate : '';
    initValues.store = sourceEntity.store;
  }

  return initValues;
};

export const ManageCustomerForm: React.FC = () => {
  const dispatch = useDispatch();

  const storesAutocomplete = useSelector<IApplicationState, IStore[]>(
    (state) => state.customer.manageCustomerForm.storesAutocomplete
  );

  const selectedCustomer = useSelector<
    IApplicationState,
    StoreCustomer | null | undefined
  >((state) => state.customer.customerState.selectedCustomer);

  const initValues = initDefaultValuesForNewStoreCustomerForm(selectedCustomer);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.rightPanel.rightPanel.commandBarItems
  );

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  let autocompleteOptions: any[] = [];

  if (storesAutocomplete) {
    storesAutocomplete.forEach((item) => {
      autocompleteOptions.push({
        key: `${item.id}`,
        text: `${item.name}`,
        rawValue: item,
      });
    });
  }

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        rightPanelActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
  }, [formikReference, dispatch]);

  useEffect(() => {
    if (new List(commandBarItems).any()) {
      dispatch(
        rightPanelActions.setPanelButtons(
          ChangeItemsDisabledState(
            commandBarItems,
            [CommandBarItem.Reset, CommandBarItem.Save],
            !isFormikDirty
          )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty, dispatch]);

  useEffect(() => {
    dispatch(customerActions.customerFormStoreAutocompleteText(''));
  }, [dispatch]);

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          customerName: Yup.string().required(
            () => 'Customer name is required'
          ),
          email: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          store: Yup.object()
            .nullable()
            .required(() => `Store is required`),
          phoneNumber: Yup.string().required(() => `Phone number is required`),
          birthDate: Yup.string().notRequired(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          if (selectedCustomer) {
            dispatch(
              customerActions.updateStoreCustomer(
                buildCustomerAccountData(values, selectedCustomer)
              )
            );
          } else {
            let createAction = assignPendingActions(
              customerActions.saveNewCustomer(buildCustomerAccountData(values)),
              [
                customerActions.getCustomersListPaginated(),
                rightPanelActions.closeRightPanel(),
              ]
            );
            dispatch(createAction);
          }
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik) {
            setFormikDirty(formik.dirty);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack>
                  <Entry
                    isRequired
                    label="Customer Name"
                    fieldName="customerName"
                    formik={formik}
                  />

                  <Entry
                    isRequired
                    label="Email"
                    fieldName="email"
                    formik={formik}
                  />

                  <FormComboBox
                    formik={formik}
                    fieldName={'store'}
                    label={'Store'}
                    isRequired
                    allowFreeform
                    options={autocompleteOptions}
                    resolveTextHandler={(formValue: any) =>
                      formValue ? formValue.name : ''
                    }
                    resolveSelectedKeyValue={(formValue: any) =>
                      formValue ? `${formValue.id}` : ''
                    }
                    resolveOnChangeValue={(
                      option: IComboBoxOption | null | undefined
                    ) => (option ? (option as any).rawValue : null)}
                    onPendingValueChanged={(value: string) =>
                      dispatch(
                        customerActions.customerFormStoreAutocompleteText(value)
                      )
                    }
                    onChanged={(option: IComboBoxOption | null | undefined) => {
                      let suggestions: any[] = [];

                      if (option && (option as any).rawValue) {
                        suggestions.push((option as any).rawValue);
                      }

                      dispatch(
                        customerActions.updateCustomerFormStoreAutocompleteList(
                          suggestions
                        )
                      );
                    }}
                  />

                  <MaskedEntry
                    isRequired
                    label="Phone Number"
                    fieldName="phoneNumber"
                    mask="(999) 999 - 9999"
                    formik={formik}
                  />

                  <FormDatePicker
                    formik={formik}
                    fieldName={'birthDate'}
                    label={'Birth Date'}
                  />
                </Stack>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ManageCustomerForm;
