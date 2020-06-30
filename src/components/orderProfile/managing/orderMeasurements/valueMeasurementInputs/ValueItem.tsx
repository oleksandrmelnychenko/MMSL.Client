import React from 'react';
import { Stack, Text, TextField } from 'office-ui-fabric-react';
import './valueItem.scss';
import { Field } from 'formik';
import {
  FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
  BASE_MEASUREMRNT_VALUES_FORM_FIELD,
  BODY_MEASUREMRNT_VALUES_FORM_FIELD,
} from '../OrderMeasurementsForm';
import {
  Measurement,
  MeasurementMapDefinition,
} from '../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  CustomerProfileSizeValue,
  ProfileTypes,
} from '../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';

export const initInputValueModelDefaults = (
  measurement: Measurement | null | undefined,
  sourceEntity: CustomerProductProfile | null | undefined
) => {
  let result: IInputValueModel[] = [];

  if (measurement?.measurementMapDefinitions) {
    result = new List(
      measurement.measurementMapDefinitions
        ? measurement.measurementMapDefinitions
        : []
    )
      .select<IInputValueModel>((mapDefinition: MeasurementMapDefinition) => {
        const resultItem = {
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

        if (sourceEntity) {
          const targetDefinitionId = mapDefinition.measurementDefinitionId;

          if (sourceEntity?.customerProfileSizeValues) {
            const profileValue:
              | CustomerProfileSizeValue
              | null
              | undefined = new List<CustomerProfileSizeValue>(
              sourceEntity.customerProfileSizeValues
            ).firstOrDefault(
              (valueItem) =>
                valueItem.measurementDefinitionId === targetDefinitionId
            );

            if (profileValue) {
              resultItem.id = profileValue.id;
              resultItem.value = profileValue.value
                ? `${profileValue.value}`
                : '';
              resultItem.fittingValue = profileValue.fittingValue
                ? `${profileValue.fittingValue}`
                : '';

              resultItem.initValue = resultItem.value;
              resultItem.initFittingValue = resultItem.fittingValue;
            }
          }
        }

        return resultItem;
      })
      .toArray();
  }

  return result;
};

export const resolveInitialValue = (
  valueItem: IInputValueModel,
  formik: any,
  isBodySizeOffset: boolean
) => {
  const initialItem: any = new List(
    formik.initialValues.valuesDefaultsHelper
  ).firstOrDefault(
    (item: any) =>
      valueItem.measurementDefinitionId === item.measurementDefinitionId
  );

  if (initialItem) {
    if (isBodySizeOffset)
      valueItem.initFittingValue = initialItem.initFittingValue;
    else valueItem.initValue = initialItem.initValue;
  } else {
    if (isBodySizeOffset) valueItem.initFittingValue = '';
    else valueItem.initValue = '';
  }
};

const _buildFieldName = (profileType: ProfileTypes, valueIndex: number) => {
  let result = '';

  if (profileType === ProfileTypes.FreshMeasurement) {
    result = `${FRESH_MEASUREMRNT_VALUES_FORM_FIELD}.${valueIndex}`;
  } else if (profileType === ProfileTypes.BaseMeasurement) {
    result = `${BASE_MEASUREMRNT_VALUES_FORM_FIELD}.${valueIndex}`;
  } else if (profileType === ProfileTypes.BodyMeasurement) {
    result = `${BODY_MEASUREMRNT_VALUES_FORM_FIELD}.${valueIndex}`;
  } else {
    debugger;
    console.log('TODO: Handle unknown ProfileTypes');
  }

  return result;
};

const _extractCurrentValueFromFormik = (
  formik: any,
  valueIndex: number,
  isBodySizeOffset: boolean
) => {
  let result = '';

  if (formik.values.profileType === ProfileTypes.FreshMeasurement) {
    result = formik.values.freshMeasuremrntValues[valueIndex].value;
  } else if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    result = formik.values.baseMeasuremrntValues[valueIndex].value;
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    if (isBodySizeOffset)
      result = formik.values.bodyMeasuremrntValues[valueIndex].fittingValue;
    else result = formik.values.bodyMeasuremrntValues[valueIndex].value;
  } else {
    debugger;
    console.log('TODO: Handle unknown ProfileTypes value');
  }

  return result;
};

const _onSetItemValue = (
  value: string,
  formik: any,
  valueIndex: number,
  isBodySizeOffset: boolean
) => {
  let formikValuePath: string = '';
  let formikField: string = '';

  if (formik.values.profileType === ProfileTypes.FreshMeasurement) {
    formikValuePath = `${FRESH_MEASUREMRNT_VALUES_FORM_FIELD}[${valueIndex}].value`;
    formikField = FRESH_MEASUREMRNT_VALUES_FORM_FIELD;
  } else if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    formikValuePath = `${BASE_MEASUREMRNT_VALUES_FORM_FIELD}[${valueIndex}].value`;
    formikField = BASE_MEASUREMRNT_VALUES_FORM_FIELD;
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    if (isBodySizeOffset) {
      formikValuePath = `${BODY_MEASUREMRNT_VALUES_FORM_FIELD}[${valueIndex}].fittingValue`;
      formikField = BODY_MEASUREMRNT_VALUES_FORM_FIELD;
    } else {
      formikValuePath = `${BODY_MEASUREMRNT_VALUES_FORM_FIELD}[${valueIndex}].value`;
      formikField = BODY_MEASUREMRNT_VALUES_FORM_FIELD;
    }
  } else {
    debugger;
    console.log('TODO: Handle unknown ProfileTypes on set  value');
  }

  formik.setFieldValue(formikValuePath, value);
  formik.setFieldTouched(formikField);
};

const _resolveIsDirty = (
  valueModel: IInputValueModel,
  isBodySizeOffset: boolean
) => {
  let result: boolean = false;

  if (isBodySizeOffset) {
    result = valueModel.fittingValue !== valueModel.initFittingValue;
  } else {
    result = valueModel.value !== valueModel.initValue;
  }

  return result;
};

export interface IInputValueModel {
  value: string;
  fittingValue: string;
  measurementDefinitionId: number;
  definitionName: string;
  id: number;
  initValue: string;
  initFittingValue: string;
}

export interface IValueItemProps {
  formik: any;
  valueModel: IInputValueModel;
  index: number;
  isBodySizeOffset: boolean;
}

export const ValueItem: React.FC<IValueItemProps> = (
  props: IValueItemProps
) => {
  return (
    <>
      <Field
        name={_buildFieldName(props.formik.values.profileType, props.index)}
      >
        {() => (
          <div
            className={
              _resolveIsDirty(props.valueModel, props.isBodySizeOffset)
                ? 'valueItem isDirty'
                : 'valueItem'
            }
          >
            <Stack horizontal horizontalAlign="space-between">
              <Stack.Item
                styles={{
                  root: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <Text>{props.valueModel.definitionName}</Text>
              </Stack.Item>
              <Stack.Item>
                <div className="valueItem__editNameInput">
                  <TextField
                    type="number"
                    borderless
                    value={_extractCurrentValueFromFormik(
                      props.formik,
                      props.index,
                      props.isBodySizeOffset
                    )}
                    onChange={(args: any) => {
                      _onSetItemValue(
                        args?.target?.value ? args.target.value : '',
                        props.formik,
                        props.index,
                        props.isBodySizeOffset
                      );
                    }}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </div>
        )}
      </Field>
    </>
  );
};

export default ValueItem;
