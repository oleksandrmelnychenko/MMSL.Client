import React from 'react';
import { Formik, Form } from 'formik';
import { Stack } from 'office-ui-fabric-react';
import '../managing/dealerManaging/manageDealerForm.scss';
import * as Yup from 'yup';
import { FormicReference } from '../../../interfaces';
import { Address } from '../../../interfaces/addresses';
import { DealerAccount } from '../../../interfaces/dealer';
import Entry from '../../../common/formFields/Entry';
import FormCheckbox from '../../../common/formFields/FormCheckbox';

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

  let billingAddress: Address;

  if (sourceDealer?.billingAddress) {
    billingAddress = { ...sourceDealer?.billingAddress } as Address;
  } else {
    billingAddress = new Address();
  }

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
      formikInitValues.addressLine2 = account.billingAddress.addressLine2;
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
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;
          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack tokens={{ childrenGap: 20 }}>
                  <Stack>
                    <div className="formScope">
                      <Entry
                        formik={formik}
                        label={'Address Line 1'}
                        fieldName={'addressLine1'}
                        isRequired={false}
                      />

                      <Entry
                        formik={formik}
                        label={'Address Line 2'}
                        fieldName={'addressLine2'}
                        isRequired={false}
                      />

                      <Stack horizontal tokens={{ childrenGap: 20 }}>
                        <Stack grow={1}>
                          <Entry
                            formik={formik}
                            label={'City'}
                            fieldName={'city'}
                            isRequired={false}
                          />

                          <Entry
                            formik={formik}
                            label={'Country'}
                            fieldName={'country'}
                            isRequired={false}
                          />
                        </Stack>
                        <Stack grow={1}>
                          <Entry
                            formik={formik}
                            label={'State'}
                            fieldName={'state'}
                            isRequired={false}
                          />

                          <Entry
                            formik={formik}
                            label={'Zip'}
                            fieldName={'zip'}
                            isRequired={false}
                          />
                        </Stack>
                      </Stack>
                    </div>
                  </Stack>
                  <div className="formScope">
                    <Stack horizontal>
                      <Stack.Item>
                        <FormCheckbox
                          formik={formik}
                          label={'Delivery address the same as billing'}
                          fieldName={'useBillingAsShipping'}
                        />
                      </Stack.Item>
                    </Stack>
                  </div>
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
