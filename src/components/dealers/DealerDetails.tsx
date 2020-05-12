import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Checkbox,
  PrimaryButton,
  Stack,
  TextField,
  MaskedTextField,
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
                  <Stack grow={2}>
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
                    <MaskedTextField
                      label="Alternative Email"
                      className="formInput"
                      placeholder="Alternative Email"
                      mask="m\ask: ****"
                      maskFormat={maskFormat}
                      maskChar="?"
                    />
                    <MaskedTextField
                      className="formInput"
                      placeholder="Phone Number"
                      mask="m\ask: (999) 999 - 9999"
                    />
                    <TextField className="formInput" placeholder="Tax Number" />
                    <Toggle
                      className="formInput"
                      label="Vat Applicate"
                      inlineLabel
                      onText="On"
                      offText="Off"
                    />
                    <Dropdown
                      className="formInput"
                      placeholder="Select Currency"
                      options={[
                        { key: 'usd', text: 'USD' },
                        { key: 'eur', text: 'EUR' },
                      ]}
                      styles={{ dropdown: { width: 300 } }}
                    />
                    <Dropdown
                      className="formInput"
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
                      className="formInput"
                      placeholder="General Text"
                      multiline
                      rows={3}
                    />
                  </Stack>

                  <Stack grow={1}>
                    <TextField
                      label="Company name"
                      placeholder="Company name"
                    />
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
