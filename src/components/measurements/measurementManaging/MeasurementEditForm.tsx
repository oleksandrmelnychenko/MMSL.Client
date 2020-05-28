import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Separator } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, Measurement } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

import { useDispatch } from 'react-redux';
import { measurementActions } from '../../../redux/slices/measurement.slice';

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

export class MeasurementEditFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.submitAction = (args: any) => {};
    this.measurement = null;
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
  measurement?: Measurement | null;
}

export const MeasurementEditForm: React.FC<MeasurementEditFormProps> = (
  props: MeasurementEditFormProps
) => {
  const initValues = initDefaultValues(props.measurement);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(measurementActions.apiGetMeasurementById(3));
  }, []);

  return (
    <div>
      <Formik
        initialValues={initValues}
        onSubmit={(values: any) => {
          //   props.submitAction(
          //     buildMeasurement(values, props.measurement as Measurement)
          //   );
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;

          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}>
        {(formik) => {
          return (
            <Form className="form">
              <Separator
                styles={{ root: { paddingBottom: '20px' } }}
                alignContent="start">
                Column names
              </Separator>
              <Stack grow={1}>
                <Field name="name">
                  {() => (
                    <div className="form__group">
                      <TextField
                        value={formik.values.name}
                        styles={fabricStyles.textFildLabelStyles}
                        className="form__group__field"
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
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MeasurementEditForm;
