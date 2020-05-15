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
import { IStore, INewStore } from '../../../interfaces';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { getTranslate, LocalizeState } from 'react-localize-redux';

interface IFormStoreProps {
  store: IStore[] | null;
}

const FormStore: React.FC<IFormStoreProps> = (props) => {
  const dispatch = useDispatch();
  const selectedDealerId = useSelector<IApplicationState, number | undefined>(
    (state) => state.dealer.selectedDealer?.id
  );

  const translate = getTranslate(
    useSelector<IApplicationState, LocalizeState>((state) => state.localize)
  );

  const selectedStore = props.store ? props.store[0] : null;
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
        onSubmit={(values: any, { resetForm }) => {
          if (selectedStore) {
            dispatch(
              dealerActions.updateDealerStore(
                builderUpdateStore(values) as IStore
              )
            );
          } else {
            dispatch(
              dealerActions.addStoreToCurrentDealer(
                builderAddStore(values) as INewStore
              )
            );
            resetForm();
          }
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
                          value={formik.values.nameStore}
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
                            value={formik.values.contactEmail}
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
                            value={formik.values.billingEmail}
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
                        <div className="dealerForm__inputBlock">
                          <TextField
                            styles={textFildLabelStyles}
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
                            <div className="dealerForm__inputBlock">
                              <TextField
                                styles={textFildLabelStyles}
                                className="formInput"
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
                            <div className="dealerForm__inputBlock noMargin">
                              <TextField
                                styles={textFildLabelStyles}
                                className="formInput"
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
                            <div className="dealerForm__inputBlock">
                              <TextField
                                styles={textFildLabelStyles}
                                className="formInput"
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
                            <div className="dealerForm__inputBlock noMargin">
                              <TextField
                                styles={textFildLabelStyles}
                                className="formInput"
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
              <PrimaryButton
                text={
                  selectedStore
                    ? (translate('updateStore') as string)
                    : (translate('createStore') as string)
                }
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
