import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../interfaces/measurements';
import { ProfileTypes } from './ProfileTypeInput';

export interface IMeasurementInputProps {
  measurements: Measurement[];
  formik: any;
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
        <Field name="measurementId">
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
                if (option) {
                  props.formik.setFieldValue(
                    'measurementId',
                    (option as any).measurement.id
                  );
                  props.formik.setFieldTouched('measurementId');
                } else {
                  props.formik.setFieldValue('measurementId', 0);
                  props.formik.setFieldTouched('measurementId');
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
