import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Checkbox, Text, Stack, TextField } from 'office-ui-fabric-react';
import '../dealerManaging/manageDealerForm.scss';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { DealerAccount, Address } from '../../../interfaces';
import { textFildLabelStyles } from '../../../common/fabric-styles/styles';
import { FormicReference } from '../dealerManaging/ManageDealerForm';

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

  debugger;
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
          if (props.formikReference.isDirtyFunc) {
            props.formikReference.isDirtyFunc(formik.dirty);
          }

          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={4} tokens={{ childrenGap: 20 }}>
                    <Stack>
                      <div className="formScope">
                        <Field name="addressLine1">
                          {() => {
                            return (
                              <div className="form__group">
                                <TextField
                                  value={formik.values.addressLine1}
                                  styles={textFildLabelStyles}
                                  className="form__group__field"
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
                        </Field>
                        <Field name="addressLine2">
                          {() => {
                            return (
                              <div className="form__group">
                                <TextField
                                  value={formik.values.addressLine2}
                                  styles={textFildLabelStyles}
                                  className="form__group__field"
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
                        </Field>
                        <Stack horizontal tokens={{ childrenGap: 20 }}>
                          <Stack grow={1}>
                            <Field name="city">
                              {() => {
                                return (
                                  <div className="form__group">
                                    <TextField
                                      value={formik.values.city}
                                      styles={textFildLabelStyles}
                                      className="form__group__field"
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
                            </Field>
                            <Field name="country">
                              {() => {
                                return (
                                  <div className="form__group">
                                    <TextField
                                      value={formik.values.country}
                                      styles={textFildLabelStyles}
                                      className="form__group__field"
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
                            </Field>
                          </Stack>
                          <Stack grow={1}>
                            <Field name="state">
                              {() => {
                                return (
                                  <div className="form__group">
                                    <TextField
                                      value={formik.values.state}
                                      styles={textFildLabelStyles}
                                      className="form__group__field"
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
                            </Field>
                            <Field name="zip">
                              {() => {
                                return (
                                  <div className="form__group">
                                    <TextField
                                      value={formik.values.zip}
                                      styles={textFildLabelStyles}
                                      className="form__group__field"
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
                            </Field>
                          </Stack>
                        </Stack>
                      </div>
                    </Stack>
                    <div className="formScope">
                      <Stack horizontal>
                        {/* <Stack.Item grow={1}> */}
                        <Text className="formScopeHeader">
                          DELIVERY ADDRESS
                        </Text>
                        {/* </Stack.Item> */}
                        <Stack.Item>
                          <Field name="useBillingAsShipping">
                            {() => {
                              return (
                                <div className="form__group">
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
                          </Field>
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
