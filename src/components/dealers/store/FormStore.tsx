import React from 'react';
import * as Yup from 'yup';
import { Field, Formik, Form } from 'formik';
import {
  Stack,
  TextField,
  FontWeights,
  PrimaryButton,
} from 'office-ui-fabric-react';
import { Text, ITextProps } from 'office-ui-fabric-react/lib/Text';
import { IStore } from '../../../interfaces';

interface IFormStoreProps {
  store: IStore[] | null;
}

const FormStore: React.FC<IFormStoreProps> = (props) => {
  const selectedStore = props.store ? props.store[0] : null;
  console.log(props.store);

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

  const initValue = () => {
    let formikInitValues = {
      nameStore: '',
      contactEmail: '',
      billingEmail: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      state: '',
      zip: '',
    };
    if (selectedStore !== null && selectedStore !== undefined) {
      formikInitValues = {
        nameStore: selectedStore.name,
        contactEmail: selectedStore.contactEmail,
        billingEmail: selectedStore.billingEmail,
        addressLine1: selectedStore.address.addressLine1,
        addressLine2: selectedStore.address.addressLine1,
        city: selectedStore.address.city,
        country: selectedStore.address.country,
        state: selectedStore.address.state,
        zip: selectedStore.address.zipCode,
      };
    }

    return formikInitValues;
  };

  return (
    <div className="dealerForm">
      <Formik
        validationSchema={Yup.object().shape({
          nameStore: Yup.string().required(() => 'Name is required'),
          contactEmail: Yup.string()
            .email('Invalid email')
            .required(() => 'Email is required'),
          billingEmail: Yup.string()
            .email('Invalid email')
            .required('Alternative email is required'),
          addressLine1: Yup.string().notRequired(),
          addressLine2: Yup.string().notRequired(),
          city: Yup.string().notRequired(),
          country: Yup.string().notRequired(),
          state: Yup.string().notRequired(),
          zip: Yup.string().notRequired(),
        })}
        initialValues={initValue()}
        onSubmit={(values: any) => {
          console.log(values);
        }}
        enableReinitialize={true}
        validateOnBlur={false}>
        {(formik) => {
          return (
            <Form>
              <Stack>
                <div className="formScope">
                  <Text className="formScopeHeader">
                    Information about store
                  </Text>
                  <Field name="nameStore">
                    {() => (
                      <div className="dealerForm__inputBlock">
                        <TextField
                          styles={textFildLabelStyles}
                          className="formInput"
                          label="Store name"
                          onChange={(args: any) => {
                            let value = args.target.value;
                            formik.setFieldValue('nameStore', value);
                            formik.setFieldTouched('nameStore');
                          }}
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="contactEmail">
                    {() => {
                      return (
                        <div className="dealerForm__inputBlock">
                          <TextField
                            styles={textFildLabelStyles}
                            className="formInput"
                            label="Email"
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('contactEmail', value);
                              formik.setFieldTouched('contactEmail');
                            }}
                          />
                          {formik.errors.contactEmail &&
                          formik.touched.contactEmail ? (
                            <Text
                              variant={'small' as ITextProps['variant']}
                              className="dealerForm__inputBlock__error">
                              {formik.errors.contactEmail}
                            </Text>
                          ) : null}
                        </div>
                      );
                    }}
                  </Field>
                  <Field name="billingEmail">
                    {() => {
                      return (
                        <div className="dealerForm__inputBlock">
                          <TextField
                            styles={textFildLabelStyles}
                            className="formInput"
                            label="Billing email"
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('billingEmail', value);
                              formik.setFieldTouched('billingEmail');
                            }}
                          />
                          {formik.errors.billingEmail &&
                          formik.touched.billingEmail ? (
                            <Text
                              variant={'small' as ITextProps['variant']}
                              className="dealerForm__inputBlock__error">
                              {formik.errors.billingEmail}
                            </Text>
                          ) : null}
                        </div>
                      );
                    }}
                  </Field>
                  <Field name="addressLine1">
                    {() => {
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
                  </Field>
                  <Field name="addressLine2">
                    {() => {
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
                  </Field>
                  <Stack horizontal tokens={{ childrenGap: 20 }}>
                    <Stack grow={1}>
                      <Field name="city">
                        {() => {
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
                      </Field>
                      <Field name="country">
                        {() => {
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
                      </Field>
                    </Stack>
                    <Stack grow={1}>
                      <Field name="state">
                        {() => {
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
                      </Field>
                      <Field name="zip">
                        {() => {
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
                      </Field>
                    </Stack>
                  </Stack>
                </div>
              </Stack>
              <PrimaryButton
                text="Save"
                allowDisabledFocus
                onClick={() => {
                  console.log(formik);
                  formik.handleSubmit();
                }}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormStore;
