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

class DealerDetailsProps {
  constructor() {
    this.formikReference = {
      formik: null,
    };
  }

  formikReference: any;
}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
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
        }}
        onSubmit={(values: any) => {
          debugger;
        }}
        validateOnBlur={false}
      >
        {(formik) => {
          props.formikReference.formik = formik;

          return (
            <Form>
              <div className="dealerForm">
                <Stack horizontal>
                  <Stack style={{ marginRight: '20px' }} grow={1}>
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
                            {formik.errors.companyName &&
                            formik.touched.companyName ? (
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
                            {formik.errors.companyName &&
                            formik.touched.companyName ? (
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
                  </Stack>

                  <Stack grow={1}>
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
                                debugger;
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
                                { key: 'bankTransfer', text: 'Bank transfer' },
                                { key: 'cash', text: 'Cash' },
                              ]}
                              styles={{ dropdown: { width: 300 } }}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                debugger;
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
                          <div className="dealerForm__inputBlock">
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
                          <div className="dealerForm__inputBlock">
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
                          <div className="dealerForm__inputBlock">
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
