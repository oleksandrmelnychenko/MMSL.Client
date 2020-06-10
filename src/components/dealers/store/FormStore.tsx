import React from 'react';
import * as Yup from 'yup';
import { Field, Formik, Form } from 'formik';
import { Stack, Separator, TextField } from 'office-ui-fabric-react';
import { FormicReference } from '../../../interfaces';
import { IStore, INewStore } from '../../../interfaces/store';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import * as fabricStyles from '../../../common/fabric-styles/styles';

interface IFormStoreProps {
  store: IStore[] | null;
  formikReference: FormicReference;
  submitAction: (args: any) => void;
}

const FormStore: React.FC<IFormStoreProps> = (props) => {
  const selectedDealerId = useSelector<IApplicationState, number | undefined>(
    (state) => state.dealer.selectedDealer?.id
  );

  const selectedStore = props.store ? props.store[0] : null;

  const builderAddStore = (value: any) => {
    let storeData: INewStore;
    if (selectedDealerId) {
      storeData = {
        address: {
          addressLine1: value.addressLine1,
          addressLine2: value.addressLine2,
          city: value.city,
          state: value.state,
          country: value.country,
          zipCode: value.zip,
        },
        dealerAccountId: selectedDealerId,
        contactEmail: value.contactEmail,
        billingEmail: value.billingEmail,
        name: value.nameStore,
      };
      return storeData;
    }
  };

  const builderUpdateStore = (value: any) => {
    if (selectedStore) {
      const updateStore: IStore = {
        addressId: selectedStore?.addressId,
        address: {
          addressLine1: value.addressLine1,
          addressLine2: value.addressLine2,
          city: value.city,
          state: value.state,
          country: value.country,
          zipCode: value.zip,
          id: selectedStore?.address.id,
          isDeleted: selectedStore?.address.isDeleted,
        },
        contactEmail: value.contactEmail,
        billingEmail: value.billingEmail,
        name: value.nameStore,
        // description: null,
        id: selectedStore?.id,
      };
      return updateStore;
    }
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
    if (selectedStore) {
      formikInitValues = {
        nameStore: selectedStore.name,
        contactEmail: selectedStore.contactEmail,
        billingEmail: selectedStore.billingEmail,
        addressLine1: selectedStore.address.addressLine1,
        addressLine2: selectedStore.address.addressLine2,
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
            .required('Billing email is required'),
          addressLine1: Yup.string().notRequired(),
          addressLine2: Yup.string().notRequired(),
          city: Yup.string().notRequired(),
          country: Yup.string().notRequired(),
          state: Yup.string().notRequired(),
          zip: Yup.string().notRequired(),
        })}
        initialValues={initValue()}
        onSubmit={(values: any, { resetForm }) => {
          if (selectedStore) {
            props.submitAction(builderUpdateStore(values) as IStore);
          } else {
            props.submitAction(builderAddStore(values) as INewStore);
          }
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;
          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        enableReinitialize={true}
        validateOnBlur={false}
      >
        {(formik) => {
          return (
            <Form className="form">
              <Stack>
                <div className="formScope">
                  <Separator alignContent="start">
                    Details: {selectedStore?.name}
                  </Separator>

                  <Field name="nameStore">
                    {() => (
                      <div className="form__group">
                        <TextField
                          styles={fabricStyles.textFildLabelStyles}
                          className="form__group__field"
                          label="Store name"
                          required
                          value={formik.values.nameStore}
                          onChange={(args: any) => {
                            let value = args.target.value;
                            formik.setFieldValue('nameStore', value);
                            formik.setFieldTouched('nameStore');
                          }}
                          errorMessage={
                            formik.errors.nameStore &&
                            formik.touched.nameStore ? (
                              <span className="form__group__error">
                                {formik.errors.nameStore}
                              </span>
                            ) : (
                              ''
                            )
                          }
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="contactEmail">
                    {() => {
                      return (
                        <div className="form__group">
                          <TextField
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Email"
                            required
                            value={formik.values.contactEmail}
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('contactEmail', value);
                              formik.setFieldTouched('contactEmail');
                            }}
                            errorMessage={
                              formik.errors.contactEmail &&
                              formik.touched.contactEmail ? (
                                <span className="form__group__error">
                                  {formik.errors.contactEmail}
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
                  <Field name="billingEmail">
                    {() => {
                      return (
                        <div className="form__group">
                          <TextField
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Billing email"
                            required
                            value={formik.values.billingEmail}
                            onChange={(args: any) => {
                              let value = args.target.value;
                              formik.setFieldValue('billingEmail', value);
                              formik.setFieldTouched('billingEmail');
                            }}
                            errorMessage={
                              formik.errors.billingEmail &&
                              formik.touched.billingEmail ? (
                                <span className="form__group__error">
                                  {formik.errors.billingEmail}
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
                  <Field name="addressLine1">
                    {() => {
                      return (
                        <div className="form__group">
                          <TextField
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Address Line 1"
                            value={formik.values.addressLine1}
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
                            styles={fabricStyles.textFildLabelStyles}
                            className="formInput"
                            label="Address Line 2"
                            value={formik.values.addressLine2}
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
                                styles={fabricStyles.textFildLabelStyles}
                                className="form__group__field"
                                label="City"
                                value={formik.values.city}
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
                            <div className="form__group noMargin">
                              <TextField
                                styles={fabricStyles.textFildLabelStyles}
                                className="form__group__field"
                                label="Country"
                                value={formik.values.country}
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
                                styles={fabricStyles.textFildLabelStyles}
                                className="form__group__field"
                                label="State"
                                value={formik.values.state}
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
                                styles={fabricStyles.textFildLabelStyles}
                                className="form__group__field"
                                label="Zip"
                                value={formik.values.zip}
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
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormStore;
