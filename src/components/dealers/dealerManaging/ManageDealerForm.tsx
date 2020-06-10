import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Stack,
  TextField,
  MaskedTextField,
  IDropdownOption,
} from 'office-ui-fabric-react';
import './manageDealerForm.scss';
import * as Yup from 'yup';
import {
  DealerAccount,
  Address,
  PaymentType,
  Currency,
  FormicReference,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import { List } from 'linq-typescript';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../helpers/commandBar.helper';
import { assignPendingActions } from '../../../helpers/action.helper';
import { dealerActions } from '../../../redux/slices/dealer.slice';

const resolveDefaultDropDownValue = (
  limitOptions: any[],
  initLimit: number
) => {
  let result;

  result = new List(limitOptions).firstOrDefault(
    (option) => option.key === `${initLimit}`
  );

  if (result === undefined || null) result = limitOptions[0];

  return result;
};

const buildDealerAccount = (values: any, sourceDealer?: DealerAccount) => {
  let dealerAccount: DealerAccount;

  if (sourceDealer) {
    dealerAccount = { ...sourceDealer };
  } else {
    dealerAccount = new DealerAccount();
    dealerAccount.billingAddress = new Address();
    dealerAccount.billingAddressId = dealerAccount.billingAddress.id;
    dealerAccount.stores = [];
  }

  dealerAccount.companyName = values.companyName;
  dealerAccount.name = values.name;
  dealerAccount.email = values.email;
  dealerAccount.alternateEmail = values.alternativeEmail;
  dealerAccount.phoneNumber = values.phoneNumber;
  dealerAccount.taxNumber = values.taxNumber;
  dealerAccount.isVatApplicable = values.vatApplicate;
  dealerAccount.currencyTypeId = parseInt(values.selectCurrency);
  dealerAccount.paymentTypeId = parseInt(values.selectPayment);
  dealerAccount.isCreditAllowed = values.creditAllowed;

  return dealerAccount;
};

const initDefaultValues = (account?: DealerAccount | null) => {
  const formikInitValues = {
    companyName: '',
    name: '',
    email: '',
    alternativeEmail: '',
    phoneNumber: '',
    taxNumber: '',
    selectCurrency: '1',
    selectPayment: '1',
    vatApplicate: false,
    creditAllowed: false,
  };

  if (account) {
    formikInitValues.companyName = account.companyName;
    formikInitValues.name = account.name;
    formikInitValues.email = account.email;
    formikInitValues.alternativeEmail = account.alternateEmail;
    formikInitValues.phoneNumber = account.phoneNumber;
    formikInitValues.taxNumber = account.taxNumber;
    formikInitValues.selectCurrency = `${account.currencyTypeId}`;
    formikInitValues.selectPayment = `${account.paymentTypeId}`;
    formikInitValues.vatApplicate = account.isVatApplicable;
    formikInitValues.creditAllowed = account.isCreditAllowed;
  }

  return formikInitValues;
};

export const ManageDealerForm: React.FC = () => {
  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const dealerAccount = useSelector<IApplicationState, DealerAccount | null>(
    (state) => state.dealer.selectedDealer
  );

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikReference]);

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
  }, [isFormikDirty]);

  const currencyOptions = [
    {
      key: '2',
      text: 'USD',
      value: Currency.USD,
    } as IDropdownOption,
    {
      key: '1',
      text: 'EUR',
      value: Currency.EUR,
    } as IDropdownOption,
  ];

  const paymentOptions = [
    {
      key: '2',
      text: 'Bank transfer',
      value: PaymentType.BankTransfer,
    } as IDropdownOption,
    {
      key: '1',
      text: 'Cash',
      value: PaymentType.Cash,
    } as IDropdownOption,
  ];

  const formikInitValues = initDefaultValues(dealerAccount);

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          companyName: Yup.string().required(() => 'Company name is required'),
          name: Yup.string().required(() => 'Name is required'),
          email: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          alternativeEmail: Yup.string()
            .email('Invalid email')
            .required('Alternative email is required'),
          phoneNumber: Yup.string().notRequired(),
          taxNumber: Yup.string().notRequired(),
          selectCurrency: Yup.string().notRequired(),
          selectPayment: Yup.string().notRequired(),
          vatApplicate: Yup.boolean().notRequired(),
          creditAllowed: Yup.boolean().notRequired(),
        })}
        initialValues={formikInitValues}
        onSubmit={(values: any) => {
          let createAction;
          if (dealerAccount) {
            createAction = assignPendingActions(
              dealerActions.updateDealer(
                buildDealerAccount(values, dealerAccount)
              )
            );
          } else {
            createAction = assignPendingActions(
              dealerActions.saveNewDealer(buildDealerAccount(values)),
              [dealerActions.getDealersListPaginated()]
            );
          }
          dispatch(createAction);
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
                    <Field name="companyName">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.companyName}
                              styles={fabricStyles.textFildLabelStyles}
                              className="form__group__field"
                              label="Company name"
                              required
                              onChange={(args: any) => {
                                let value = args.target.value;

                                formik.setFieldValue('companyName', value);
                                formik.setFieldTouched('companyName');
                              }}
                              errorMessage={
                                formik.errors.companyName &&
                                formik.touched.companyName ? (
                                  <span className="form__group__error">
                                    {formik.errors.companyName}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <Field name="name">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.name}
                              styles={fabricStyles.textFildLabelStyles}
                              className="form__group__field"
                              label="Name"
                              required
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('name', value);
                                formik.setFieldTouched('name');
                              }}
                              errorMessage={
                                formik.errors.name && formik.touched.name ? (
                                  <span className="form__group__error">
                                    {formik.errors.name}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <Field name="email">
                      {() => {
                        return (
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
                        );
                      }}
                    </Field>

                    <Field name="alternativeEmail">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.alternativeEmail}
                              styles={fabricStyles.textFildLabelStyles}
                              label="Alternative Email"
                              required
                              className="form__group__field"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('alternativeEmail', value);
                                formik.setFieldTouched('alternativeEmail');
                              }}
                              errorMessage={
                                formik.errors.alternativeEmail &&
                                formik.touched.alternativeEmail ? (
                                  <span className="form__group__error">
                                    {formik.errors.alternativeEmail}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="phoneNumber">
                      {() => {
                        return (
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
                        );
                      }}
                    </Field>

                    <Field name="taxNumber">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.taxNumber}
                              styles={fabricStyles.textFildLabelStyles}
                              label="Tax Number"
                              className="form__group__field"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('taxNumber', value);
                                formik.setFieldTouched('taxNumber');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </Stack>
                  <Stack grow={1}>
                    <Field name="selectCurrency">
                      {() => {
                        return (
                          <div className="form__group">
                            <Dropdown
                              defaultSelectedKey={
                                resolveDefaultDropDownValue(
                                  currencyOptions,
                                  parseInt(formik.values.selectCurrency)
                                ).key
                              }
                              className="form__group__field"
                              label="Select Currency"
                              options={currencyOptions}
                              styles={fabricStyles.dropDownStyles}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                let value = item.value;
                                formik.setFieldValue('selectCurrency', value);
                                formik.setFieldTouched('selectCurrency');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="selectPayment">
                      {() => {
                        return (
                          <div className="form__group">
                            <Dropdown
                              className="form__group__field"
                              label="Select Payment"
                              options={paymentOptions}
                              defaultSelectedKey={
                                resolveDefaultDropDownValue(
                                  paymentOptions,
                                  parseInt(formik.values.selectPayment)
                                ).key
                              }
                              styles={fabricStyles.dropDownStyles}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                let value = item.value;
                                formik.setFieldValue('selectPayment', value);
                                formik.setFieldTouched('selectPayment');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="vatApplicate">
                      {() => {
                        return (
                          <div className="form__group">
                            <Toggle
                              checked={formik.values.vatApplicate}
                              styles={fabricStyles.toggleStyles}
                              className="form__group__field"
                              label="Vat Applicate"
                              inlineLabel
                              onText="On"
                              offText="Off"
                              onChange={(checked: any, isChecked: any) => {
                                formik.setFieldValue('vatApplicate', isChecked);
                                formik.setFieldTouched('vatApplicate');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="creditAllowed">
                      {() => {
                        return (
                          <div className="form__group">
                            <Toggle
                              checked={formik.values.creditAllowed}
                              className="form__group__field"
                              label="Credit Allowed"
                              styles={fabricStyles.toggleStyles}
                              inlineLabel
                              onText="On"
                              offText="Off"
                              onChange={(checked: any, isChecked: any) => {
                                formik.setFieldValue(
                                  'creditAllowed',
                                  isChecked
                                );
                                formik.setFieldTouched('creditAllowed');
                              }}
                            />
                          </div>
                        );
                      }}
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

export default ManageDealerForm;
