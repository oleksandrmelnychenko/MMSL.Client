import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../interfaces/orderProfile';
import { updateFormChartValues } from './MeasurementInput';
import {
  PROFILE_TYPE_FORM_FIELD,
  FITTING_TYPE_ID_FORM_FIELD,
  MEASUREMENT_SIZE_ID_FORM_FIELD,
} from '../../ProfileForm';

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

            if (value === ProfileTypes.FreshMeasurement) {
              props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
              props.formik.setFieldValue(MEASUREMENT_SIZE_ID_FORM_FIELD, 0);
            } else if (value === ProfileTypes.BaseMeasurement) {
              props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
            } else if (value === ProfileTypes.BodyMeasurement) {
              props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
            } else if (value === ProfileTypes.Reference) {
              props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
              props.formik.setFieldValue(MEASUREMENT_SIZE_ID_FORM_FIELD, 0);
            }

            props.formik.setFieldValue(PROFILE_TYPE_FORM_FIELD, value);
            props.formik.setFieldTouched(PROFILE_TYPE_FORM_FIELD);

            updateFormChartValues(
              props.formik.values.measurementId,
              props.availableMeasurements,
              props.formik,
              props.orderProfile
            );
          }}
        />
      )}
    </Field>
  );
};

export default ProfileTypeInput;
