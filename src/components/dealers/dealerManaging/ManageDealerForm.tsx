import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Text,
  Stack,
  TextField,
  MaskedTextField,
  ITextProps,
  IDropdownOption,
} from 'office-ui-fabric-react';
import './manageDealerForm.scss';
import * as Yup from 'yup';
import {
  DealerAccount,
  Address,
  PaymentType,
  Currency,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

class ManageDealerFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.dealerAccount = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  dealerAccount?: DealerAccount | null;
  submitAction: (args: any) => void;
}

export class FormicReference {
  constructor(isDirtyFunc?: (isDirty: boolean) => void) {
    this.formik = null;
    this.isDirtyFunc = isDirtyFunc;
  }

  formik: any;
  isDirtyFunc?: (isDirty: boolean) => void;
}

/// TOODO: resolve with Linq
const resolveDefaultDropDownValue = (
  limitOptions: any[],
  initLimit: number
) => {
  let result;

  limitOptions.forEach((option) => {
    if (option.key === `${initLimit}`) {
      result = option;
    }
  });

  if (result === undefined || null) {
    result = limitOptions[0];
  }

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

  if (account !== null && account !== undefined) {
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

export const ManageDealerForm: React.FC<ManageDealerFormProps> = (
  props: ManageDealerFormProps
) => {
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

  const formikInitValues = initDefaultValues(props.dealerAccount);

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
          props.submitAction(
            buildDealerAccount(values, props.dealerAccount as DealerAccount)
          );
        }}
        validateOnBlur={false}
      >
        {(formik) => {
          props.formikReference.formik = formik;

          return (
            <Form>
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field
                      name="companyName"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.companyName}
                              styles={fabricStyles.textFildLabelStyles}
                              className="formInput"
                              label="Company name"
                              onChange={(args: any) => {
                                let value = args.target.value;

                                formik.setFieldValue('companyName', value);
                                formik.setFieldTouched('companyName');
                              }}
                            />
                            {formik.errors.companyName &&
                            formik.touched.companyName ? (
                              <Text
                                variant={'small' as ITextProps['variant']}
                                className="dealerForm__inputBlock__error"
                              >
                                {formik.errors.companyName}
                              </Text>
                            ) : null}
                          </div>
                        );
                      }}
                    ></Field>
                    <Field
                      name="name"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.name}
                              styles={fabricStyles.textFildLabelStyles}
                              className="formInput"
                              label="Name"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('name', value);
                                formik.setFieldTouched('name');
                              }}
                            />
                            {formik.errors.name && formik.touched.name ? (
                              <Text
                                variant={'small' as ITextProps['variant']}
                                className="dealerForm__inputBlock__error"
                              >
                                {formik.errors.name}
                              </Text>
                            ) : null}
                          </div>
                        );
                      }}
                    ></Field>
                    <Field
                      name="email"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.email}
                              styles={fabricStyles.textFildLabelStyles}
                              className="formInput"
                              label="Email"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('email', value);
                                formik.setFieldTouched('email');
                              }}
                            />
                            {formik.errors.email && formik.touched.email ? (
                              <Text
                                variant={'small' as ITextProps['variant']}
                                className="dealerForm__inputBlock__error"
                              >
                                {formik.errors.email}
                              </Text>
                            ) : null}
                          </div>
                        );
                      }}
                    ></Field>

                    <Field
                      name="alternativeEmail"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.alternativeEmail}
                              styles={fabricStyles.textFildLabelStyles}
                              label="Alternative Email"
                              className="formInput"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('alternativeEmail', value);
                                formik.setFieldTouched('alternativeEmail');
                              }}
                            />
                            {formik.errors.alternativeEmail &&
                            formik.touched.alternativeEmail ? (
                              <Text
                                variant={'small' as ITextProps['variant']}
                                className="dealerForm__inputBlock__error"
                              >
                                {formik.errors.alternativeEmail}
                              </Text>
                            ) : null}
                          </div>
                        );
                      }}
                    ></Field>

                    <Field
                      name="phoneNumber"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <MaskedTextField
                              value={formik.values.phoneNumber}
                              styles={fabricStyles.textFildLabelStyles}
                              className="formInput"
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
                    ></Field>

                    <Field
                      name="taxNumber"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.taxNumber}
                              styles={fabricStyles.textFildLabelStyles}
                              label="Tax Number"
                              className="formInput"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('taxNumber', value);
                                formik.setFieldTouched('taxNumber');
                              }}
                            />
                          </div>
                        );
                      }}
                    ></Field>
                  </Stack>
                  <Stack grow={1}>
                    <Field
                      name="selectCurrency"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <Dropdown
                              defaultSelectedKey={
                                resolveDefaultDropDownValue(
                                  currencyOptions,
                                  parseInt(formik.values.selectCurrency)
                                ).key
                              }
                              className="formInput"
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
                    ></Field>

                    <Field
                      name="selectPayment"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <Dropdown
                              className="formInput"
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
                    ></Field>

                    <Field
                      name="vatApplicate"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock noMargin">
                            <Toggle
                              checked={formik.values.vatApplicate}
                              styles={fabricStyles.toggleStyles}
                              className="formInput"
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
                    ></Field>

                    <Field
                      name="creditAllowed"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock noMargin">
                            <Toggle
                              checked={formik.values.creditAllowed}
                              className="formInput"
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
                    ></Field>
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
