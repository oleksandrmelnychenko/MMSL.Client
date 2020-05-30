import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  MaskedTextField,
  DatePicker,
  DayOfWeek,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  StoreCustomer,
  IStore,
  Address,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import * as fabricControlSettings from '../../../common/fabric-control-settings/fabricControlSettings';
import { useSelector, useDispatch } from 'react-redux';

import { IApplicationState } from '../../../redux/reducers';
import {
  GetCommandBarItemProps,
  CommandBarItem,
} from '../../../helpers/commandBar.helper';
import { controlActions } from '../../../redux/slices/control.slice';

export class CreateStoreCustomerFormInitValues {
  constructor() {
    this.userName = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
    this.birthDate = '1989-05-11T21:00:00.000Z';
    this.store = null;
  }

  userName: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  store: IStore | null;
}

const buildNewStoreCustomerAccount = (
  values: any,
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

  newAccount.userName = values.userName;
  newAccount.customerName = values.customerName;
  newAccount.email = values.email;
  newAccount.phoneNumber = values.phoneNumber;
  newAccount.birthDate = values.birthDate;
  newAccount.store = values.store;
  newAccount.storeId = newAccount.store?.id;

  return newAccount;
};

const initDefaultValuesForNewStoreCustomerForm = (
  sourceEntity?: StoreCustomer | null
) => {
  const initValues = new CreateStoreCustomerFormInitValues();

  if (sourceEntity) {
    initValues.userName = sourceEntity.userName;
    initValues.customerName = sourceEntity.customerName;
    initValues.email = sourceEntity.email;
    initValues.phoneNumber = sourceEntity.phoneNumber;
    initValues.birthDate = sourceEntity.birthDate;
    initValues.store = sourceEntity.store;
  }

  return initValues;
};

class ManageCustomerFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.customer = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  customer?: StoreCustomer | null;
  submitAction: (args: any) => void;
}

export const ManageCustomerForm: React.FC = () => {
  const initValues = initDefaultValuesForNewStoreCustomerForm();
  const storesAutocomplete = useSelector<IApplicationState, IStore[]>(
    (state) => state.customer.manageCustomerForm.storesAutocomplete
  );

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (formikReference.formik) {
      let buttons = [];

      buttons.push(
        GetCommandBarItemProps(CommandBarItem.Save, () => {
          formikReference.formik.submitForm();
        })
      );

      buttons.push(
        GetCommandBarItemProps(CommandBarItem.Delete, () => {
          // dispatch(userManagementActions.api_removeUser(selectedUser.NetUid));
        })
      );

      dispatch(controlActions.setPanelButtons(buttons));
    }
  }, [formikReference]);

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

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          userName: Yup.string().required(() => 'User name is required'),
          customerName: Yup.string().required(
            () => 'Customer name is required'
          ),
          email: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          phoneNumber: Yup.string().notRequired(),
          birthDate: Yup.string().notRequired(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          // submitAction(buildNewStoreCustomerAccount(values));
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik) {
            if (formikReference.isDirtyFunc)
              formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        enableReinitialize={true}
        validateOnBlur={false}>
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="userName">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.userName}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="User name"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('userName', value);
                              formik.setFieldTouched('userName');
                            }}
                            errorMessage={
                              formik.errors.userName &&
                              formik.touched.userName ? (
                                <span className="form__group__error">
                                  {formik.errors.userName}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="customerName">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.customerName}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Customer Name"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('customerName', value);
                              formik.setFieldTouched('customerName');
                            }}
                            errorMessage={
                              formik.errors.customerName &&
                              formik.touched.customerName ? (
                                <span className="form__group__error">
                                  {formik.errors.customerName}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="email">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.email}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Email"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('email', value);
                              formik.setFieldTouched('email');
                            }}
                            errorMessage={
                              formik.errors.email && formik.touched.email ? (
                                <span className="form__group__error">
                                  {formik.errors.email}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="phoneNumber">
                      {() => (
                        <div className="form__group">
                          <MaskedTextField
                            value={formik.values.phoneNumber}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Phone Number"
                            mask="(999)999-9999"
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('phoneNumber', value);
                              formik.setFieldTouched('phoneNumber');
                            }}
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="birthDate">
                      {() => (
                        <div className="form__group">
                          <DatePicker
                            formatDate={fabricControlSettings.onFormatDate}
                            firstDayOfWeek={DayOfWeek.Monday}
                            strings={fabricControlSettings.dayPickerStrings}
                            textField={fabricStyles.datePickerStyles}
                            value={new Date(formik.values.birthDate)}
                            label="Birth Date"
                            onSelectDate={(date: Date | null | undefined) => {
                              let value = '';

                              if (date) value = date.toJSON();

                              formik.setFieldValue('birthDate', value);
                              formik.setFieldTouched('birthDate');
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </Stack>
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
