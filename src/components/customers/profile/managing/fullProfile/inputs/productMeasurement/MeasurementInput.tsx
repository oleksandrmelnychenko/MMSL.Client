import React from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import {
  Measurement,
  MeasurementMapDefinition,
} from '../../../../../../../interfaces/measurements';
import { IInputValueModel } from './ValueItem';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import {
  MEASUREMENT_ID_FORM_FIELD,
  MEASUREMENT_VALUES_FORM_FIELD,
  FITTING_TYPE_ID_FORM_FIELD,
  MEASUREMENT_SIZE_ID_FORM_FIELD,
} from '../../../fullProfile/ProfileForm';

export interface IMeasurementInputProps {
  measurements: Measurement[];
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

const buildMeasurementDefinitionsValues = (
  targetMeasurementId: number,
  measurements: Measurement[]
) => {
  let result: IInputValueModel[] = [];

  const targetMeasurement: Measurement | null | undefined = new List(
    measurements
  ).firstOrDefault((measurement) => measurement.id === targetMeasurementId);

  if (targetMeasurement?.measurementMapDefinitions) {
    result = new List(
      targetMeasurement.measurementMapDefinitions
        ? targetMeasurement.measurementMapDefinitions
        : []
    )
      .select<IInputValueModel>((mapDefinition: MeasurementMapDefinition) => {
        const resultItem: IInputValueModel = {
          value: '',
          fittingValue: '',
          measurementDefinitionId: mapDefinition.measurementDefinitionId,
          definitionName: mapDefinition.measurementDefinition
            ? mapDefinition.measurementDefinition.name
            : '',
          id: 0,
          initValue: '',
          initFittingValue: '',
        };

        return resultItem;
      })
      .toArray();
  }

  return result;
};

const extractDefaultFalues = (
  valueMaps: IInputValueModel[],
  defaults: IInputValueModel[]
) => {
  return valueMaps.map((valueModel: IInputValueModel, index: number) => {
    let mapResult: IInputValueModel = valueModel;
    mapResult.value = '';
    mapResult.fittingValue = '';

    if (
      index < defaults.length &&
      mapResult.measurementDefinitionId ===
        defaults[index].measurementDefinitionId
    ) {
      mapResult.value = defaults[index].value;
      mapResult.fittingValue = defaults[index].fittingValue;
      mapResult.initValue = defaults[index].initValue;
      mapResult.initFittingValue = defaults[index].initFittingValue;
    }

    return mapResult;
  });
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
            <div className="form__group">
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

                  props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
                  props.formik.setFieldValue(MEASUREMENT_SIZE_ID_FORM_FIELD, 0);

                  props.formik.setFieldValue(
                    MEASUREMENT_VALUES_FORM_FIELD,
                    extractDefaultFalues(
                      buildMeasurementDefinitionsValues(
                        measurementId,
                        props.measurements
                      ),
                      props.formik.values.valuesDefaultsHelper
                    )
                  );

                  props.formik.setFieldValue(
                    MEASUREMENT_ID_FORM_FIELD,
                    measurementId
                  );
                  props.formik.setFieldTouched(MEASUREMENT_ID_FORM_FIELD);
                }}
              />
              {props.formik.errors.measurementId &&
              props.formik.touched.measurementId ? (
                <span className="form__group__error formFieldError">
                  {props.formik.errors.measurementId}
                </span>
              ) : null}
            </div>
          )}
        </Field>
      )}
    </>
  );
};

export default MeasurementInput;
