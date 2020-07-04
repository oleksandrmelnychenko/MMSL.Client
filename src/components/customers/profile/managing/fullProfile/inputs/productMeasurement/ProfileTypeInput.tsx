import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import { Measurement } from '../../../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../interfaces/orderProfile';
import {
  PROFILE_TYPE_FORM_FIELD,
  FITTING_TYPE_ID_FORM_FIELD,
  MEASUREMENT_SIZE_ID_FORM_FIELD,
  MEASUREMENT_VALUES_FORM_FIELD,
} from '../../ProfileForm';
import { IInputValueModel } from './ValueItem';

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

const _helper = (
  valueMaps: IInputValueModel[],
  defaults: IInputValueModel[],
  onlyForFittingValues: boolean
) => {
  return valueMaps.map((valueModel: IInputValueModel, index: number) => {
    let mapResult: IInputValueModel = valueModel;
    if (!onlyForFittingValues) {
      mapResult.value = '';
    }

    mapResult.fittingValue = '';

    if (
      index < defaults.length &&
      mapResult.measurementDefinitionId ===
        defaults[index].measurementDefinitionId
    ) {
      if (!onlyForFittingValues) {
        mapResult.value = defaults[index].value;
        mapResult.initValue = defaults[index].initValue;
      }
      mapResult.fittingValue = defaults[index].fittingValue;
      mapResult.initFittingValue = defaults[index].initFittingValue;
    }

    // mapResult.value = '';
    // mapResult.fittingValue = '';

    // mapResult.initValue = defaults[index].initValue;
    // mapResult.initFittingValue = defaults[index].initFittingValue;

    return mapResult;
  });
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

            if (value === ProfileTypes.Reference) {
              props.formik.setFieldValue(
                MEASUREMENT_VALUES_FORM_FIELD,
                _helper(
                  props.formik.values.measurementValues,
                  props.formik.values.valuesDefaultsHelper,
                  false
                )
              );
            } else {
              props.formik.setFieldValue(
                MEASUREMENT_VALUES_FORM_FIELD,
                _helper(
                  props.formik.values.measurementValues,
                  props.formik.values.valuesDefaultsHelper,
                  true
                )
              );
            }

            props.formik.setFieldValue(PROFILE_TYPE_FORM_FIELD, value);
            props.formik.setFieldTouched(PROFILE_TYPE_FORM_FIELD);
          }}
        />
      )}
    </Field>
  );
};

export default ProfileTypeInput;
