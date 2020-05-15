import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Checkbox,
  Text,
  Stack,
  TextField,
  MaskedTextField,
  ITextProps,
  IDropdownOption,
} from 'office-ui-fabric-react';
import './manageDealerForm.scss';
import * as Yup from 'yup';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../helpers/action.helper';
import { FontSizes, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import {
  DealerAccount,
  Address,
  PaymentType,
  Currency,
} from '../../interfaces';

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
  constructor() {
    this.formik = null;
  }

  formik: any;
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
  let dealerAccount: DealerAccount = {
    id: 0,
    isDeleted: false,
    companyName: values.companyName,
    email: values.email,
    alternateEmail: values.alternativeEmail,
    phoneNumber: values.phoneNumber,
    taxNumber: values.taxNumber,
    isVatApplicable: values.vatApplicate,
    currencyTypeId: parseInt(values.selectCurrency),
    paymentTypeId: parseInt(values.selectPayment),
    isCreditAllowed: values.creditAllowed,
    billingAddressId: null,
    billingAddress: null,
    useBillingAsShipping: values.useBillingAsShipping,
    shippingAddressId: null,
    /// TODO:
    shippingAddress: null,
    stores: [],
  } as DealerAccount;

  let billingAddress = {
    addressLine1: values.addressLine1,
    addressLine2: values.addressLine2,
    city: values.city,
    state: values.state,
    country: values.country,
    zipCode: values.zip,
  } as Address;

  dealerAccount.billingAddress = billingAddress;

  if (sourceDealer !== null && sourceDealer !== undefined) {
    dealerAccount.id = sourceDealer.id;
    dealerAccount.isDeleted = sourceDealer.isDeleted;
    dealerAccount.billingAddressId = sourceDealer.billingAddressId;
    dealerAccount.shippingAddressId = sourceDealer.shippingAddressId;

    if (
      sourceDealer.billingAddress !== null &&
      sourceDealer.billingAddress !== undefined
    ) {
      dealerAccount.billingAddress.id = sourceDealer.billingAddress.id;
      dealerAccount.billingAddress.isDeleted =
        sourceDealer.billingAddress.isDeleted;
    }
  }

  return dealerAccount;
};

const initDefaultValues = (account?: DealerAccount | null) => {
  const formikInitValues = {
    companyName: '',
    /// TODO: missing
    name: '',
    email: '',
    alternativeEmail: '',
    phoneNumber: '',
    taxNumber: '',
    selectCurrency: '1',
    selectPayment: '1',
    vatApplicate: false,
    creditAllowed: false,
    generalText: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    useBillingAsShipping: false,
  };

  if (account !== null && account !== undefined) {
    formikInitValues.companyName = account.companyName;
    /// TODO: missing
    // formikInitValues.name = props.dealerAccount.Name;
    formikInitValues.email = account.email;
    formikInitValues.alternativeEmail = account.alternateEmail;
    formikInitValues.phoneNumber = account.phoneNumber;
    formikInitValues.taxNumber = account.taxNumber;
    /// TODO: important
    // formikInitValues.selectCurrency = props.dealerAccount.currency;
    formikInitValues.selectCurrency = `${account.currencyTypeId}`;

    /// TODO: important
    // formikInitValues.selectPayment = props.dealerAccount.paymentType;
    formikInitValues.selectPayment = `${account.paymentTypeId}`;

    formikInitValues.vatApplicate = account.isVatApplicable;
    formikInitValues.creditAllowed = account.isCreditAllowed;
    /// TODO: missing
    // formikInitValues.generalText =  = props.dealerAccount.alternateEmail;

    if (
      account.billingAddress !== null &&
      account.billingAddress !== undefined
    ) {
      formikInitValues.addressLine1 = account.billingAddress.addressLine1;
      formikInitValues.addressLine2 = account.billingAddress.addressLine1;
      formikInitValues.city = account.billingAddress.city;
      formikInitValues.country = account.billingAddress.country;
      formikInitValues.state = account.billingAddress.state;
      formikInitValues.zip = account.billingAddress.zipCode;
    }

    formikInitValues.useBillingAsShipping = account.useBillingAsShipping;
  }

  return formikInitValues;
};

export const ManageDealerForm: React.FC<ManageDealerFormProps> = (
  props: ManageDealerFormProps
) => {
  const textFildLabelStyles = {
    subComponentStyles: {
      label: {
        root: {
          fontWeight: FontWeights.light,
          paddingBottom: '2px',
        },
      },
    },
  };

  const dropDownStyles = {
    // dropdown: { width: 300 },
    label: {
      fontWeight: FontWeights.light,
      paddingBottom: '2px',
    },
    title: {
      letterSpacing: '1px',
    },
  };

  const toggleStyles = {
    label: {
      fontWeight: FontWeights.light,
    },
  };

  const currencyOptions = [
    {
      key: '1',
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
          //   name: Yup.string().required(() => 'Name is required'),
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
          //   generalText: Yup.string().notRequired(),
          addressLine1: Yup.string().notRequired(),
          addressLine2: Yup.string().notRequired(),
          city: Yup.string().notRequired(),
          country: Yup.string().notRequired(),
          state: Yup.string().notRequired(),
          zip: Yup.string().notRequired(),
          useBillingAsShipping: Yup.boolean().notRequired(),
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
                  <Stack grow={4}>
                    <Field
                      name="companyName"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.companyName}
                              styles={textFildLabelStyles}
                              className="formInput"
                              label="Company name"
                              onChange={(args: any) => {
                                let value = args.target.value;

                                formik.setFieldValue('companyName', value);
                                formik.setFieldTouched('companyName');
                                console.log(value);
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
                    {/* <Field
                      name="name"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.name}
                              styles={textFildLabelStyles}
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
                    ></Field> */}
                    <Field
                      name="email"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              value={formik.values.email}
                              styles={textFildLabelStyles}
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
                              styles={textFildLabelStyles}
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
                              styles={textFildLabelStyles}
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
                              styles={textFildLabelStyles}
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

                    {/* <Field
                      name="generalText"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock noMargin">
                            <TextField
                              value={formik.values.generalText}
                              styles={textFildLabelStyles}
                              label="General Text"
                              className="formInput"
                              multiline
                              rows={3}
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('generalText', value);
                                formik.setFieldTouched('generalText');
                              }}
                            />
                          </div>
                        );
                      }}
                    ></Field> */}
                  </Stack>
                  <Stack>
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
                              styles={dropDownStyles}
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
                              styles={dropDownStyles}
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
                              styles={toggleStyles}
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
                              styles={toggleStyles}
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
                  <Stack grow={2} tokens={{ childrenGap: 20 }}>
                    <Stack>
                      <div className="formScope">
                        <Text className="formScopeHeader">BILLING ADDRESS</Text>
                        <Field
                          name="addressLine1"
                          render={() => {
                            return (
                              <div className="dealerForm__inputBlock">
                                <TextField
                                  value={formik.values.addressLine1}
                                  styles={textFildLabelStyles}
                                  className="formInput"
                                  label="Address Line 1"
                                  onChange={(args: any) => {
                                    let value = args.target.value;
                                    formik.setFieldValue('addressLine1', value);
                                    formik.setFieldTouched('addressLine1');
                                  }}
                                />
                              </div>
                            );
                          }}
                        ></Field>
                        <Field
                          name="addressLine2"
                          render={() => {
                            return (
                              <div className="dealerForm__inputBlock">
                                <TextField
                                  value={formik.values.addressLine2}
                                  styles={textFildLabelStyles}
                                  className="formInput"
                                  label="Address Line 2"
                                  onChange={(args: any) => {
                                    let value = args.target.value;
                                    formik.setFieldValue('addressLine2', value);
                                    formik.setFieldTouched('addressLine2');
                                  }}
                                />
                              </div>
                            );
                          }}
                        ></Field>
                        <Stack horizontal tokens={{ childrenGap: 20 }}>
                          <Stack grow={1}>
                            <Field
                              name="city"
                              render={() => {
                                return (
                                  <div className="dealerForm__inputBlock">
                                    <TextField
                                      value={formik.values.city}
                                      styles={textFildLabelStyles}
                                      className="formInput"
                                      label="City"
                                      onChange={(args: any) => {
                                        let value = args.target.value;
                                        formik.setFieldValue('city', value);
                                        formik.setFieldTouched('city');
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            ></Field>
                            <Field
                              name="country"
                              render={() => {
                                return (
                                  <div className="dealerForm__inputBlock noMargin">
                                    <TextField
                                      value={formik.values.country}
                                      styles={textFildLabelStyles}
                                      className="formInput"
                                      label="Country"
                                      onChange={(args: any) => {
                                        let value = args.target.value;
                                        formik.setFieldValue('country', value);
                                        formik.setFieldTouched('country');
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            ></Field>
                          </Stack>
                          <Stack grow={1}>
                            <Field
                              name="state"
                              render={() => {
                                return (
                                  <div className="dealerForm__inputBlock">
                                    <TextField
                                      value={formik.values.state}
                                      styles={textFildLabelStyles}
                                      className="formInput"
                                      label="State"
                                      onChange={(args: any) => {
                                        let value = args.target.value;
                                        formik.setFieldValue('state', value);
                                        formik.setFieldTouched('state');
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            ></Field>
                            <Field
                              name="zip"
                              render={() => {
                                return (
                                  <div className="dealerForm__inputBlock noMargin">
                                    <TextField
                                      value={formik.values.zip}
                                      styles={textFildLabelStyles}
                                      className="formInput"
                                      label="Zip"
                                      onChange={(args: any) => {
                                        let value = args.target.value;
                                        formik.setFieldValue('zip', value);
                                        formik.setFieldTouched('zip');
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            ></Field>
                          </Stack>
                        </Stack>
                      </div>
                    </Stack>
                    <div className="formScope">
                      <Stack horizontal>
                        <Stack.Item grow={1}>
                          <Text className="formScopeHeader">
                            DELIVERY ADDRESS
                          </Text>
                        </Stack.Item>
                        <Stack.Item>
                          <Field
                            name="useBillingAsShipping"
                            render={() => {
                              return (
                                <div className="dealerForm__inputBlock noMargin">
                                  <Checkbox
                                    checked={formik.values.useBillingAsShipping}
                                    label="Use same as billing"
                                    onChange={(
                                      checked: any,
                                      isChecked: any
                                    ) => {
                                      formik.setFieldValue(
                                        'useBillingAsShipping',
                                        isChecked
                                      );
                                      formik.setFieldTouched(
                                        'useBillingAsShipping'
                                      );
                                    }}
                                  />
                                </div>
                              );
                            }}
                          ></Field>
                        </Stack.Item>
                      </Stack>
                    </div>
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
