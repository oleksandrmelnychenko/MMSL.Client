import React, { useState, useEffect, useContext } from 'react';
import * as Yup from 'yup';
import { Stack, Text, Label, TextField } from 'office-ui-fabric-react';
import { Formik, Form, Field } from 'formik';
import { DealerAccount, FormicReference } from '../../../../../interfaces';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import './assignedDealersList.scss';

/// Build single hint lable
const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

const _initDefaultValues = () => {
  const initValues: any = { companyName: '' };

  return initValues;
};

export enum DealerDetailsState {
  NotTouched,
  Explore,
  Edit,
}

export class DealerDetailsProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.dealer = null;
    this.state = DealerDetailsState.NotTouched;
  }

  formikReference: FormicReference;
  dealer: DealerAccount | null | undefined;
  state: DealerDetailsState;
}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  return (
    <div className="dealerDetails">
      {props.state !== DealerDetailsState.NotTouched ? (
        <Formik
          validationSchema={Yup.object().shape({
            companyName: Yup.string(),
          })}
          initialValues={_initDefaultValues()}
          onSubmit={(values: any) => {
            debugger;
          }}
          onReset={(values: any, formikHelpers: any) => {}}
          innerRef={(formik: any) => {
            props.formikReference.formik = formik;
            // if (formik) setFormikDirty(formik.dirty);
          }}
          validateOnBlur={false}
          enableReinitialize={true}
        >
          {(formik) => {
            return (
              <Form className="form">
                <Stack>
                  <Field name="name">
                    {() => (
                      <div className="form__group">
                        <TextField
                          value={formik.values.name}
                          styles={fabricStyles.textFildLabelStyles}
                          className="form__group__field"
                          label="Name"
                          required
                          onChange={(args: any) => {
                            formik.setFieldValue('name', args.target.value);
                            formik.setFieldTouched('name');
                          }}
                          errorMessage={
                            formik.errors.name && formik.touched.name ? (
                              <span className="form__group__error">
                                {formik.errors.name}
                              </span>
                            ) : (
                              ''
                            )
                          }
                        />
                      </div>
                    )}
                  </Field>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      ) : (
        _renderHintLable(
          'Select and explore or assign new dealer for current style permission.'
        )
      )}
    </div>
  );
};

export default DealerDetails;
