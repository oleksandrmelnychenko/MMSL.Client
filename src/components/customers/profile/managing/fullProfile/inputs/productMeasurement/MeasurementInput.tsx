import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../../../../interfaces/measurements';
import { initInputValueModelDefaults } from './ValueItem';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import {
  FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
  BASE_MEASUREMRNT_VALUES_FORM_FIELD,
  BODY_MEASUREMRNT_VALUES_FORM_FIELD,
  MEASUREMENT_ID_FORM_FIELD,
} from '../../../fullProfile/ProfileForm';

export interface IMeasurementInputProps {
  measurements: Measurement[];
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const updateFormChartValues = (
  targetMeasurementId: number,
  measurements: Measurement[],
  formik: any,
  orderProfile: CustomerProductProfile | null | undefined
) => {
  if (targetMeasurementId !== 0) {
    const targetMeasurement: Measurement | null | undefined = new List(
      measurements
    ).firstOrDefault((measurement) => measurement.id === targetMeasurementId);

    formik.setFieldValue(
      FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
      initInputValueModelDefaults(targetMeasurement, orderProfile)
    );

    formik.setFieldValue(
      BASE_MEASUREMRNT_VALUES_FORM_FIELD,
      initInputValueModelDefaults(targetMeasurement, orderProfile)
    );

    formik.setFieldValue(
      BODY_MEASUREMRNT_VALUES_FORM_FIELD,
      initInputValueModelDefaults(targetMeasurement, orderProfile)
    );
  } else {
    formik.setFieldValue(FRESH_MEASUREMRNT_VALUES_FORM_FIELD, []);
    formik.setFieldValue(BASE_MEASUREMRNT_VALUES_FORM_FIELD, []);
    formik.setFieldValue(BODY_MEASUREMRNT_VALUES_FORM_FIELD, []);
  }
};

const _buildOptions = (measurements: Measurement[]) => {
  return measurements.map((measurement: Measurement, index: number) => {
    return {
      key: `${measurement.id}`,
      text: measurement.name,
      measurement: measurement,
    } as IDropdownOption;
  });
};

export const MeasurementInput: React.FC<IMeasurementInputProps> = (
  props: IMeasurementInputProps
) => {
  const options = _buildOptions(props.measurements);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.Reference ? null : (
        <Field name={MEASUREMENT_ID_FORM_FIELD}>
          {() => (
            <Dropdown
              defaultSelectedKey={`${props.formik.values.measurementId}`}
              label="Chart"
              options={options}
              style={{ width: '300px' }}
              styles={fabricStyles.comboBoxStyles}
              onChange={(
                event: React.FormEvent<HTMLDivElement>,
                option?: any,
                index?: number
              ) => {
                const measurementId = option?.measurement
                  ? option.measurement.id
                  : 0;

                updateFormChartValues(
                  measurementId,
                  props.measurements,
                  props.formik,
                  props.orderProfile
                );

                props.formik.setFieldValue(
                  MEASUREMENT_ID_FORM_FIELD,
                  measurementId
                );
                props.formik.setFieldTouched(MEASUREMENT_ID_FORM_FIELD);
              }}
            />
          )}
        </Field>
      )}
    </>
  );
};

export default MeasurementInput;
