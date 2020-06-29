import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../interfaces/measurements';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { PROFILE_TYPE_FORM_FIELD } from './OrderMeasurementsForm';

export interface IProfileTypeInputProps {
  formik: any;
  availableMeasurements: Measurement[];
}

export enum ProfileTypes {
  FreshMeasurement,
  BaseMeasurement,
  BodyMeasurement,
  Reference,
}

export const resolveProfileTypeInitValue = (
  availableMeasurements: Measurement[],
  sourceEntity?: CustomerProductProfile | null | undefined
) => {
  let initValue = ProfileTypes.FreshMeasurement;

  if (availableMeasurements.length === 0) {
    initValue = ProfileTypes.Reference;
  }

  if (sourceEntity) {
    /// TODO
  }

  return initValue;
};

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
          styles={fabricStyles.comboBoxStyles}
          onChange={(
            event: React.FormEvent<HTMLDivElement>,
            option?: IDropdownOption,
            index?: number
          ) => {
            if (option) {
              props.formik.setFieldValue(
                PROFILE_TYPE_FORM_FIELD,
                (option as any).profileType
              );
              props.formik.setFieldTouched(PROFILE_TYPE_FORM_FIELD);
            } else {
              props.formik.setFieldValue(
                PROFILE_TYPE_FORM_FIELD,
                ProfileTypes.FreshMeasurement
              );
              props.formik.setFieldTouched(PROFILE_TYPE_FORM_FIELD);
            }
          }}
        />
      )}
    </Field>
  );
};

export default ProfileTypeInput;
