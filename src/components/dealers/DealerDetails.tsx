import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Checkbox,
  PrimaryButton,
  Text,
  Stack,
  TextField,
  MaskedTextField,
  FontWeights,
  ITextProps,
} from 'office-ui-fabric-react';
import './dealerDetails.scss';
import * as Yup from 'yup';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../helpers/action.helper';

export class DealerAccount {
  constructor() {
    this.companyName = '';
    this.email = '';
    this.alternateEmail = '';
    this.phoneNumber = '';
    this.taxNumber = '';
    this.isVatApplicable = false;
    this.currency = 0;
    this.paymentType = 0;
    this.isCreditAllowed = false;
    this.billingAddressId = null;
    this.billingAddress = null;
    this.useBillingAsShipping = false;
    this.shippingAddressId = null;
    this.shippingAddress = null;
    this.stores = [];
  }

  companyName: string;
  email: string;
  alternateEmail: string;
  phoneNumber: string;
  taxNumber: string;
  isVatApplicable: boolean;
  currency: number;
  paymentType: number;
  isCreditAllowed: boolean;
  billingAddressId: number | null;
  billingAddress: Address | null;
  useBillingAsShipping: boolean;
  shippingAddressId: number | null;
  shippingAddress: Address | null;
  stores: any[];
}

export class Address {
  constructor() {
    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.zipCode = false;
  }

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: boolean;
}

class DealerDetailsProps {
  constructor() {
    this.formikReference = {
      formik: null,
    };
  }

  formikReference: any;
}

const buildDealerAccount = (values: any) => {
  let dealerAccount: DealerAccount = {
    companyName: values.companyName,
    email: values.email,
    alternateEmail: values.alternativeEmail,
    phoneNumber: values.phoneNumber,
    taxNumber: values.taxNumber,
    isVatApplicable: values.vatApplicate,
    /// TODO:
    currency: 0,
    /// TODO:
    paymentType: 0,
    isCreditAllowed: values.creditAllowed,
    billingAddressId: null,
    /// TODO:
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

  return dealerAccount;
};

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  const dispatch = useDispatch();

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          companyName: Yup.string().required(() => 'Company name is required'),
          name: Yup.string().required(() => 'Name is required'),
          email: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          alternativeEmail: Yup.string().email('Invalid email').notRequired(),
          phoneNumber: Yup.string().notRequired(),
          taxNumber: Yup.string().notRequired(),
          selectCurrency: Yup.string().notRequired(),
          selectPayment: Yup.string().notRequired(),
          vatApplicate: Yup.boolean().notRequired(),
          creditAllowed: Yup.boolean().notRequired(),
          generalText: Yup.string().notRequired(),
          addressLine1: Yup.string().notRequired(),
          addressLine2: Yup.string().notRequired(),
          city: Yup.string().notRequired(),
          country: Yup.string().notRequired(),
          state: Yup.string().notRequired(),
          zip: Yup.string().notRequired(),
          useBillingAsShipping: Yup.boolean().notRequired(),
        })}
        initialValues={{
          companyName: '',
          name: '',
          email: '',
          alternativeEmail: '',
          phoneNumber: '',
          taxNumber: '',
          selectCurrency: '',
          selectPayment: '',
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
        }}
        onSubmit={(values: any) => {
          let createAction = assignPendingActions(
            dealerActions.saveNewDealer(buildDealerAccount(values)),
            [dealerActions.getDealersList()]
          );

          dispatch(createAction);
        }}
        validateOnBlur={false}
      >
        {(formik) => {
          props.formikReference.formik = formik;

          return (
            <Form>
              <div className="dealerForm">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={3}>
                    <Field
                      name="companyName"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              className="formInput"
                              label="Company name"
                              placeholder="Company name"
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
                    <Field
                      name="name"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
                              className="formInput"
                              label="Name"
                              placeholder="Name"
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
                              className="formInput"
                              label="Email"
                              placeholder="Email"
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
                              label="Alternative Email"
                              className="formInput"
                              placeholder="Alternative Email"
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
                              className="formInput"
                              label="Phone Number"
                              placeholder="Phone Number"
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
                              label="Tax Number"
                              className="formInput"
                              placeholder="Tax Number"
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

                    <Field
                      name="selectCurrency"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <Dropdown
                              className="formInput"
                              label="Select Currency"
                              placeholder="Select Currency"
                              options={[
                                { key: 'usd', text: 'USD' },
                                { key: 'eur', text: 'EUR' },
                              ]}
                              styles={{ dropdown: { width: 300 } }}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                let value = item.text;
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
                              placeholder="Select Payment"
                              options={[
                                {
                                  key: 'bankTransfer',
                                  text: 'Bank transfer',
                                },
                                { key: 'cash', text: 'Cash' },
                              ]}
                              styles={{ dropdown: { width: 300 } }}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                let value = item.text;
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
                              className="formInput"
                              label="Credit Allowed"
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

                    <Field
                      name="generalText"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock noMargin">
                            <TextField
                              label="General Text"
                              className="formInput"
                              placeholder="General Text"
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
                    ></Field>
                  </Stack>
                  <Stack grow={1} tokens={{ childrenGap: 20 }}>
                    <Stack>
                      <div className="formScope">
                        <Text className="formScopeHeader">BILLING ADDRESS</Text>
                        <Field
                          name="addressLine1"
                          render={() => {
                            return (
                              <div className="dealerForm__inputBlock">
                                <TextField
                                  className="formInput"
                                  label="Address Line 1"
                                  placeholder="Address Line 1"
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
                                  className="formInput"
                                  label="Address Line 2"
                                  placeholder="Address Line 2"
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
                                      className="formInput"
                                      label="City"
                                      placeholder="City"
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
                                      className="formInput"
                                      label="Country"
                                      placeholder="Country"
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
                                      className="formInput"
                                      label="State"
                                      placeholder="State"
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
                                      className="formInput"
                                      label="Zip"
                                      placeholder="Zip"
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

export default DealerDetails;
