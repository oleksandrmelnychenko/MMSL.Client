import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  MaskedTextField,
  DatePicker,
  DayOfWeek,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../interfaces';
import { Address } from '../../../interfaces/addresses';
import { StoreCustomer } from '../../../interfaces/storeCustomer';
import { IStore } from '../../../interfaces/store';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import * as fabricControlSettings from '../../../common/fabric-control-settings/fabricControlSettings';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { dateToString } from '../../../helpers/date.helper';

interface IFormValues {
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  store: IStore | null;
}

const buildNewStoreCustomerAccount = (
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
export const ManageCustomerForm: React.FC<ManageCustomerFormProps> = (
  props: ManageCustomerFormProps
) => {
  const initValues = initDefaultValuesForNewStoreCustomerForm(props.customer);

  const storesAutocomplete = useSelector<IApplicationState, IStore[]>(
    (state) => state.customer.manageCustomerForm.storesAutocomplete
  );

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
          customerName: Yup.string().required(
            () => 'Customer name is required'
          ),
          email: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          phoneNumber: Yup.string().required(() => 'Phone number is required'),
          birthDate: Yup.string().notRequired(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(buildNewStoreCustomerAccount(values));
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;

          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        enableReinitialize={true}
        validateOnBlur={false}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
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
                            required
                            mask="(999)999-9999"
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('phoneNumber', value);
                              formik.setFieldTouched('phoneNumber');
                            }}
                            errorMessage={
                              formik.errors.phoneNumber &&
                              formik.touched.phoneNumber ? (
                                <span className="form__group__error">
                                  {formik.errors.phoneNumber}
                                </span>
                              ) : (
                                ''
                              )
                            }
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
                            // value={new Date(formik.values.birthDate)}
                            value={
                              formik.values.birthDate
                                ? new Date(formik.values.birthDate)
                                : undefined
                            }
                            label="Birth Date"
                            onSelectDate={(date: Date | null | undefined) => {
                              formik.setFieldValue(
                                'birthDate',
                                dateToString(date)
                              );
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
