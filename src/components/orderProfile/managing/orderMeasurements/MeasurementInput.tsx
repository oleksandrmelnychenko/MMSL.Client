import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../interfaces/measurements';
import { ProfileTypes } from './ProfileTypeInput';
import { initInputValueModelDefaults } from './valueMeasurementInputs/FreshMeasurementInput';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import {
  MEASUREMENT_ID_FORM_FIELD,
  FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
} from './OrderMeasurementsForm';

export interface IMeasurementInputProps {
  measurements: Measurement[];
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

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
              label="Size charts"
              options={options}
              styles={fabricStyles.comboBoxStyles}
              onChange={(
                event: React.FormEvent<HTMLDivElement>,
                option?: IDropdownOption,
                index?: number
              ) => {
                if (option && (option as any).measurement) {
                  const measurementId = (option as any).measurement.id;

                  if (measurementId !== props.formik.values.measurementId) {
                    props.formik.setFieldValue(
                      FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
                      initInputValueModelDefaults(
                        new List(props.measurements).firstOrDefault(
                          (measurement) => measurement.id === measurementId
                        ),
                        props.orderProfile
                      )
                    );
                  }

                  props.formik.setFieldValue(
                    MEASUREMENT_ID_FORM_FIELD,
                    measurementId
                  );
                  props.formik.setFieldTouched(MEASUREMENT_ID_FORM_FIELD);
                } else {
                  props.formik.setFieldValue(MEASUREMENT_ID_FORM_FIELD, 0);
                  props.formik.setFieldTouched(MEASUREMENT_ID_FORM_FIELD);

                  props.formik.setFieldValue(
                    FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
                    []
                  );
                }
              }}
            />
          )}
        </Field>
      )}
    </>
  );
};

export default MeasurementInput;
