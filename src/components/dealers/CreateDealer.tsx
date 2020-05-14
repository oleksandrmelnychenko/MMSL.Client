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
import './createDealer.scss';
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

class CreateDealerProps {
  constructor() {
    this.formikReference = {
      formik: null,
    };
  }

  formikReference: any;
}

const buildDealerAccount = (values: any) => {
  let dealerAccount: DealerAccount = {
    id: 0,
    isDeleted: false,
    companyName: values.companyName,
    email: values.email,
    alternateEmail: values.alternativeEmail,
    phoneNumber: values.phoneNumber,
    taxNumber: values.taxNumber,
    isVatApplicable: values.vatApplicate,
    currency: values.selectCurrency,
    paymentType: values.selectPayment,
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

  return dealerAccount;
};

export const CreateDealer: React.FC<CreateDealerProps> = (
  props: CreateDealerProps
) => {
  const dispatch = useDispatch();

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
    dropdown: { width: 300 },
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
            [
              dealerActions.getDealersListPaginated(),
              dealerActions.toggleNewDealerForm(false),
            ]
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
                  <Stack grow={2}>
                    <Field
                      name="companyName"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
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
                    <Field
                      name="name"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
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
                    ></Field>
                    <Field
                      name="email"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <TextField
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

                    <Field
                      name="generalText"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock noMargin">
                            <TextField
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
                    ></Field>
                  </Stack>
                  <Stack>
                    <Field
                      name="selectCurrency"
                      render={() => {
                        return (
                          <div className="dealerForm__inputBlock">
                            <Dropdown
                              className="formInput"
                              label="Select Currency"
                              options={[
                                {
                                  key: 'usd',
                                  text: 'USD',
                                  value: Currency.USD,
                                } as IDropdownOption,
                                {
                                  key: 'eur',
                                  text: 'EUR',
                                  value: Currency.EUR,
                                } as IDropdownOption,
                              ]}
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
                              options={[
                                {
                                  key: 'bankTransfer',
                                  text: 'Bank transfer',
                                  value: PaymentType.BankTransfer,
                                } as IDropdownOption,
                                {
                                  key: 'cash',
                                  text: 'Cash',
                                  value: PaymentType.Cash,
                                } as IDropdownOption,
                              ]}
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
                  <Stack grow={4} tokens={{ childrenGap: 20 }}>
                    <Stack>
                      <div className="formScope">
                        <Text className="formScopeHeader">BILLING ADDRESS</Text>
                        <Field
                          name="addressLine1"
                          render={() => {
                            return (
                              <div className="dealerForm__inputBlock">
                                <TextField
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

export default CreateDealer;
