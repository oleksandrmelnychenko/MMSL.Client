import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, Measurement } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

export class MeasurementFormInitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const buildMeasurement = (
  values: MeasurementFormInitValues,
  sourceEntity?: Measurement
) => {
  let newUnit: Measurement;

  if (sourceEntity) {
    newUnit = { ...sourceEntity };
  } else {
    newUnit = new Measurement();
  }

  newUnit.name = values.name;
  newUnit.description = values.description;

  return newUnit;
};

const initDefaultValues = (sourceEntity?: Measurement | null) => {
  const initValues: MeasurementFormInitValues = new MeasurementFormInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

export class MeasurementFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.submitAction = (args: any) => {};
    this.measurement = null;
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
  measurement?: Measurement | null;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = (
  props: MeasurementFormProps
) => {
  const initValues = initDefaultValues(props.measurement);

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          description: Yup.string(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          debugger;
          props.submitAction(
            buildMeasurement(values, props.measurement as Measurement)
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
                <Stack grow={1}>
                  <Field name="name">
                    {() => (
                      <div className="form__group">
                        <TextField
                          value={formik.values.name}
                          styles={fabricStyles.textFildLabelStyles}
                          className="form__group__field"
                          label="Value"
                          required
                          onChange={(args: any) => {
                            let value = args.target.value;

                            formik.setFieldValue('name', value);
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

                  <Field name="description">
                    {() => (
                      <div className="form__group">
                        <TextField
                          value={formik.values.description}
                          styles={fabricStyles.textFildLabelStyles}
                          className="form__group__field"
                          label="Description"
                          required
                          onChange={(args: any) => {
                            let value = args.target.value;

                            formik.setFieldValue('description', value);
                            formik.setFieldTouched('description');
                          }}
                          errorMessage={
                            formik.errors.description &&
                            formik.touched.description ? (
                              <span className="form__group__error">
                                {formik.errors.description}
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
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MeasurementForm;
