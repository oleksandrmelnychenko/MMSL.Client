import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  MaskedTextField,
  IDatePickerStrings,
  DatePicker,
  ComboBox,
  DayOfWeek,
  IComboBoxOption,
} from 'office-ui-fabric-react';
// import './manageDealerForm.scss';
import * as Yup from 'yup';
import { FormicReference, StoreCustomer, IStore } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import {
  initDefaultValuesForNewStoreCustomerForm,
  buildNewStoreCustomerAccount,
} from './customer.form.helpers';
import { useDispatch, useSelector } from 'react-redux';
import * as customerActions from '../../../redux/actions/customer.actions';
import { IApplicationState } from '../../../redux/reducers';

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

const dayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker',
};

export const ManageCustomerForm: React.FC<ManageCustomerFormProps> = (
  props: ManageCustomerFormProps
) => {
  const dispatch = useDispatch();

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
          userName: Yup.string().required(() => 'User name is required'),
          customerName: Yup.string().required(
            () => 'Customer name is required'
          ),
          email: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          store: Yup.object()
            .nullable()
            .required(() => `Store is required`),
          phoneNumber: Yup.string().notRequired(),
          birthDate: Yup.string().notRequired(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(
            buildNewStoreCustomerAccount(
              values,
              props.customer as StoreCustomer
            )
          );
        }}
        validateOnBlur={false}
      >
        {(formik) => {
          props.formikReference.formik = formik;
          if (props.formikReference.isDirtyFunc)
            props.formikReference.isDirtyFunc(formik.dirty);

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
                    <Field name="store">
                      {() => (
                        <div className="form__group">
                          <ComboBox
                            className="form__group__comboBox"
                            label="Store"
                            selectedKey={
                              formik.values.store
                                ? `${formik.values.store.id}`
                                : ''
                            }
                            key={'' + true + true}
                            allowFreeform={true}
                            onPendingValueChanged={(
                              option?: IComboBoxOption,
                              index?: number,
                              value?: string
                            ) => {
                              if (value !== undefined) {
                                dispatch(
                                  customerActions.customerFormStoreAutocompleteText(
                                    value ? value : ''
                                  )
                                );
                              }
                            }}
                            onChange={(
                              event: any,
                              option?: IComboBoxOption,
                              index?: number,
                              value?: string
                            ) => {
                              if (option && (option as any).rawValue) {
                                formik.setFieldValue(
                                  'store',
                                  (option as any).rawValue
                                );
                                formik.setFieldTouched('store');
                                /// Remove all syggestions and set just one selected item
                                dispatch(
                                  customerActions.updateCustomerFormStoreAutocompleteList(
                                    [(option as any).rawValue]
                                  )
                                );
                              } else {
                                formik.setFieldValue('store', null);
                                formik.setFieldTouched('store');
                                /// Clear suggestions list
                                dispatch(
                                  customerActions.updateCustomerFormStoreAutocompleteList(
                                    []
                                  )
                                );
                              }
                            }}
                            styles={fabricStyles.comboBoxStyles}
                            required
                            autoComplete={true ? 'on' : 'off'}
                            options={autocompleteOptions}
                            errorMessage={
                              formik.errors.store && formik.touched.store
                                ? ' '
                                : ' '
                            }
                          />
                          {formik.errors.store && formik.touched.store ? (
                            <span className="form__group__error ownError">
                              `{formik.errors.store}`
                            </span>
                          ) : null}
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
                            mask="(999) 999 - 9999"
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
                            firstDayOfWeek={DayOfWeek.Monday}
                            strings={dayPickerStrings}
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
