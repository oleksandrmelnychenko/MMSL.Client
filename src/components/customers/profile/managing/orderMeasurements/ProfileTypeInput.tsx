import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../interfaces/orderProfile';
import { PROFILE_TYPE_FORM_FIELD } from './OrderMeasurementsForm';
import { updateFormChartValues } from './MeasurementInput';

export interface IProfileTypeInputProps {
  formik: any;
  availableMeasurements: Measurement[];
  orderProfile: CustomerProductProfile | null | undefined;
}

const _buildOptions = (availableMeasurements: Measurement[]) => {
  const disabledOptionHint: string =
    availableMeasurements.length === 0 ? ' (no cahrts)' : '';

  return [
    {
      key: `${ProfileTypes.FreshMeasurement}`,
      text: `Fresh Measurement${disabledOptionHint}`,
      disabled: availableMeasurements.length === 0,
      profileType: ProfileTypes.FreshMeasurement,
    } as IDropdownOption,
    {
      key: `${ProfileTypes.BaseMeasurement}`,
      text: `Base Measurement${disabledOptionHint}`,
      disabled: availableMeasurements.length === 0,
      profileType: ProfileTypes.BaseMeasurement,
    },
    {
      key: `${ProfileTypes.BodyMeasurement}`,
      text: `Body Measurement${disabledOptionHint}`,
      disabled: availableMeasurements.length === 0,
      profileType: ProfileTypes.BodyMeasurement,
    },
    {
      key: `${ProfileTypes.Reference}`,
      text: 'Reference',
      profileType: ProfileTypes.Reference,
    } as IDropdownOption,
  ];
};

export const ProfileTypeInput: React.FC<IProfileTypeInputProps> = (
  props: IProfileTypeInputProps
) => {
  return (
    <Field name={PROFILE_TYPE_FORM_FIELD}>
      {() => (
        <Dropdown
          defaultSelectedKey={`${props.formik.values.profileType}`}
          label="Profile Type"
          options={_buildOptions(props.availableMeasurements)}
          style={{ width: '300px' }}
          styles={fabricStyles.comboBoxStyles}
          onChange={(
            event: React.FormEvent<HTMLDivElement>,
            option?: any,
            index?: number
          ) => {
            const value = option
              ? option.profileType
              : ProfileTypes.FreshMeasurement;

            updateFormChartValues(
              props.formik.values.measurementId,
              props.availableMeasurements,
              props.formik,
              props.orderProfile
            );

            props.formik.setFieldValue(PROFILE_TYPE_FORM_FIELD, value);
            props.formik.setFieldTouched(PROFILE_TYPE_FORM_FIELD);
          }}
        />
      )}
    </Field>
  );
};

export default ProfileTypeInput;
