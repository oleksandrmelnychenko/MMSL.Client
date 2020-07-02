import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  MaskedTextField,
  DatePicker,
  ComboBox,
  DayOfWeek,
  IComboBoxOption,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../interfaces';
import { Address } from '../../../interfaces/addresses';
import { IStore } from '../../../interfaces/store';
import { StoreCustomer } from '../../../interfaces/storeCustomer';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import * as fabricControlSettings from '../../../common/fabric-control-settings/fabricControlSettings';
import { useDispatch, useSelector } from 'react-redux';
import { customerActions } from '../../../redux/slices/customer.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../helpers/commandBar.helper';
import { controlActions } from '../../../redux/slices/control.slice';
import { IApplicationState } from '../../../redux/reducers/index';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';
import { dateToString } from '../../../helpers/date.helper';

export class CreateStoreCustomerFormInitValues {
  constructor() {
    this.userName = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
    // this.birthDate = '1989-05-11T21:00:00.000Z';
    this.birthDate = '';
    this.store = null;
  }

  userName: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  store: IStore | null;
}

const buildCustomerAccountData = (
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
  // newAccount.birthDate = values.birthDate ? values.birthDate : null;
  newAccount.birthDate = values.birthDate ? values.birthDate : null;
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
    (state) => state.control.rightPanel.commandBarItems
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
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            debugger;
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
        controlActions.setPanelButtons(
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
                controlActions.closeRightPanel(),
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
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="userName">
                      {() => (
                        <div className="form__group">
                          <TextField
                            autoComplete={'off'}
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
                            autoComplete={'off'}
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
                            autoComplete={'off'}
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
                            text={
                              formik.values.store
                                ? formik.values.store.name
                                : ''
                            }
                            label="Store"
                            selectedKey={
                              formik.values.store
                                ? `${formik.values.store.id}`
                                : ''
                            }
                            allowFreeform
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
                                /// Remove all suggestions and set just one selected item
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
                            options={autocompleteOptions}
                            errorMessage={
                              formik.errors.store && formik.touched.store
                                ? ' '
                                : ' '
                            }
                          />
                          {formik.errors.store && formik.touched.store ? (
                            <span className="form__group__error ownError">
                              {formik.errors.store}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </Field>

                    <Field name="phoneNumber">
                      {() => (
                        <div className="form__group">
                          <MaskedTextField
                            autoComplete={'off'}
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
                            allowTextInput={true}
                            showGoToToday={false}
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
