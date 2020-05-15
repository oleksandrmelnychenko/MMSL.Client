import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Checkbox, Text, Stack, TextField } from 'office-ui-fabric-react';
import '../dealerManaging/manageDealerForm.scss';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { DealerAccount, Address } from '../../../interfaces';

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

  dealerAccount.useBillingAsShipping = values.useBillingAsShipping;

  let billingAddress = { ...sourceDealer?.billingAddress } as Address;
  billingAddress.addressLine1 = values.addressLine1;
  billingAddress.addressLine2 = values.addressLine2;
  billingAddress.city = values.city;
  billingAddress.state = values.state;
  billingAddress.country = values.country;
  billingAddress.zipCode = values.zip;

  dealerAccount.billingAddress = billingAddress;

  return dealerAccount;
};

const initDefaultValues = (account?: DealerAccount | null) => {
  const formikInitValues = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    useBillingAsShipping: false,
  };

  if (account !== null && account !== undefined) {
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

export const BillingAddressForm: React.FC<ManageDealerFormProps> = (props) => {
  const dispatch = useDispatch();

  const textFildLabelStyles = {
    subComponentStyles: {
      label: {
        root: {
          fontWeight: FontWeights.semibold,
          paddingBottom: '2px',
        },
      },
    },
  };

  const formikInitValues = initDefaultValues(props.dealerAccount);

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
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
          //TODO fix SUBMIT
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

export default BillingAddressForm;
