import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Checkbox,
  PrimaryButton,
} from 'office-ui-fabric-react';
import './dealerDetails.scss';

export const DealerDetails: React.FC = (props: any) => {
  return (
    <div>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {(formik) => {
          return (
            <Form>
              <div className="dealerForm">
                <div className="dealerForm__formInputs">
                  <div className="dealerForm__info">
                    <div className="formInput">
                      <Field
                        name="companyName"
                        placeholder="Company Name"
                        type="text"
                      />
                    </div>
                    <div className="formInput">
                      <Field name="name" placeholder="Name" type="text" />
                    </div>
                    <div className="formInput">
                      <Field name="email" placeholder="Email" type="email" />
                    </div>
                    <div className="formInput">
                      <Field
                        name="alternateEmail"
                        placeholder="Alternate Email"
                        type="email"
                      />
                    </div>
                    <div className="formInput">
                      <Field
                        name="phoneNumber"
                        placeholder="Phone Number"
                        type="text"
                      />
                    </div>
                    <div className="formInput">
                      <Field
                        name="taxNumber"
                        placeholder="Tax Number"
                        type="text"
                      />
                    </div>
                    <div className="formInput">
                      <Toggle
                        label="Vat Applicable"
                        defaultChecked
                        inlineLabel
                        onText="On"
                        offText="Off"
                      />
                    </div>
                    <div className="formInput">
                      <Dropdown
                        placeholder="Select Currency"
                        options={[
                          { key: 'usd', text: 'USD' },
                          { key: 'eur', text: 'EUR' },
                        ]}
                        styles={{ dropdown: { width: 300 } }}
                      />
                    </div>
                    <div className="formInput">
                      <Dropdown
                        placeholder="Select Payment"
                        options={[
                          { key: 'bankTransfer', text: 'Bank transfer' },
                          { key: 'cash', text: 'Cash' },
                        ]}
                        styles={{ dropdown: { width: 300 } }}
                      />
                    </div>

                    <div className="formInput">
                      <Toggle
                        label="Credit Allowed"
                        defaultChecked
                        inlineLabel
                        onText="On"
                        offText="Off"
                      />
                    </div>
                    <div className="formInput">
                      <textarea placeholder="General Text" />
                    </div>

                    <PrimaryButton text="Save" allowDisabledFocus />
                  </div>

                  <div className="dealerForm__billingInfo">
                    <div className="dealerForm__billingInfo__billingAddress">
                      <div>Billing Address</div>

                      <div className="formInput">
                        <Field
                          name="addressLine1"
                          placeholder="Address Line 1"
                          type="text"
                        />
                      </div>

                      <div className="formInput">
                        <Field
                          name="addressLine2"
                          placeholder="Address Line 2"
                          type="text"
                        />
                      </div>

                      <div className="dealerForm__billingInfo__addresses">
                        <div className="dealerForm__billingInfo__addresses">
                          <div className="formInput">
                            <Field name="city" placeholder="City" type="text" />
                          </div>
                          <div className="formInput">
                            <Field
                              name="country"
                              placeholder="Country"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="dealerForm__billingInfo__addresses">
                          <div className="formInput">
                            <Field
                              name="state"
                              placeholder="State"
                              type="text"
                            />
                          </div>
                          <div className="formInput">
                            <Field name="zip" placeholder="zip" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dealerForm__billingInfo__deliveryAddress">
                      <div>Delivery Address</div>
                      <Checkbox label="Use same as Billing Address" />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default DealerDetails;
