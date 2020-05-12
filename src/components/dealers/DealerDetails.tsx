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
} from 'office-ui-fabric-react';
import './dealerDetails.scss';

export const DealerDetails: React.FC = (props: any) => {
  const maskFormat: { [key: string]: RegExp } = {
    '*': /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  };

  return (
    <div>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {(formik) => {
          return (
            <Form>
              <div className="dealerForm">
                <Stack horizontal>
                  <Stack style={{ marginRight: '20px' }} grow={1}>
                    <TextField
                      className="formInput"
                      label="Company name"
                      placeholder="Company name"
                    />
                    <TextField
                      className="formInput"
                      label="Name"
                      placeholder="Name"
                    />
                    <TextField
                      className="formInput"
                      label="Email"
                      placeholder="Email"
                    />
                    <TextField
                      label="Alternative Email"
                      className="formInput"
                      placeholder="Alternative Email"
                    />
                    <MaskedTextField
                      className="formInput"
                      label="Phone Number"
                      placeholder="Phone Number"
                      mask="(999) 999 - 9999"
                    />
                    <MaskedTextField
                      label="Tax Number"
                      className="formInput"
                      placeholder="Tax Number"
                    />
                    <Toggle
                      className="formInput"
                      label="Vat Applicate"
                      inlineLabel
                      onText="On"
                      offText="Off"
                    />
                    <Dropdown
                      className="formInput"
                      label="Select Currency"
                      placeholder="Select Currency"
                      options={[
                        { key: 'usd', text: 'USD' },
                        { key: 'eur', text: 'EUR' },
                      ]}
                      styles={{ dropdown: { width: 300 } }}
                    />
                    <Dropdown
                      className="formInput"
                      label="Select Payment"
                      placeholder="Select Payment"
                      options={[
                        { key: 'bankTransfer', text: 'Bank transfer' },
                        { key: 'cash', text: 'Cash' },
                      ]}
                      styles={{ dropdown: { width: 300 } }}
                    />
                    <Toggle
                      className="formInput"
                      label="Credit Allowed"
                      inlineLabel
                      onText="On"
                      offText="Off"
                    />
                    <TextField
                      label="General Text"
                      className="formInput"
                      placeholder="General Text"
                      multiline
                      rows={3}
                    />
                  </Stack>

                  <Stack grow={1}>
                    <div className="formScope">
                      <Text className="formScopeHeader">BILLING ADDRESS</Text>
                      <TextField
                        className="formInput"
                        label="Address Line 1"
                        placeholder="Address Line 1"
                      />
                      <TextField
                        className="formInput"
                        label="Address Line 2"
                        placeholder="Address Line 2"
                      />

                      <Stack horizontal>
                        <Stack style={{ marginRight: '10px' }} grow={1}>
                          <TextField
                            className="formInput"
                            label="City"
                            placeholder="City"
                          />
                          <TextField
                            className="formInput"
                            label="Country"
                            placeholder="Country"
                          />
                        </Stack>
                        <Stack style={{ marginLeft: '10px' }} grow={1}>
                          <TextField
                            className="formInput"
                            label="State"
                            placeholder="State"
                          />
                          <TextField
                            className="formInput"
                            label="Zip"
                            placeholder="Zip"
                          />
                        </Stack>
                      </Stack>
                    </div>

                    <div className="formScope" style={{ marginTop: '10px' }}>
                      <Stack horizontal>
                        <Stack.Item grow={1}>
                          <Text className="formScopeHeader">
                            DELIVERY ADDRESS
                          </Text>
                        </Stack.Item>

                        <Checkbox label="Use same as billing" />
                      </Stack>
                    </div>
                  </Stack>
                </Stack>

                {/* <PrimaryButton
                  style={{ marginTop: '30px' }}
                  text="Save"
                  allowDisabledFocus
                /> */}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default DealerDetails;
