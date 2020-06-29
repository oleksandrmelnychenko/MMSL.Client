import React, { useState, useEffect } from 'react';
import { Stack, Text, TextField } from 'office-ui-fabric-react';
import './valueItem.scss';
import { Field } from 'formik';
import { ProfileTypes } from '../ProfileTypeInput';
import {
  FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
  BASE_MEASUREMRNT_VALUES_FORM_FIELD,
} from '../OrderMeasurementsForm';

const _buildFieldName = (profileType: ProfileTypes, valueIndex: number) => {
  let result = '';

  if (profileType === ProfileTypes.FreshMeasurement) {
    result = `${FRESH_MEASUREMRNT_VALUES_FORM_FIELD}.${valueIndex}`;
  } else if (profileType === ProfileTypes.BaseMeasurement) {
    result = `${BASE_MEASUREMRNT_VALUES_FORM_FIELD}.${valueIndex}`;
  } else if (profileType === ProfileTypes.BodyMeasurement) {
    debugger;
    console.log('TODO: ProfileTypes.BodyMeasurement');
  } else {
    debugger;
    console.log('TODO: Handle unknown ProfileTypes');
  }

  return result;
};

const _extractCurrentValueFromFormik = (formik: any, valueIndex: number) => {
  let result = '';

  if (formik.values.profileType === ProfileTypes.FreshMeasurement) {
    result = formik.values.freshMeasuremrntValues[valueIndex].value;
  } else if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    result = formik.values.baseMeasuremrntValues[valueIndex].value;
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    debugger;
    console.log('TODO: ProfileTypes.BodyMeasurement value');
    // result = formik.values.baseMeasuremrntValues[valueIndex].fittingValue;
  } else {
    debugger;
    console.log('TODO: Handle unknown ProfileTypes value');
  }

  return result;
};

const _onSetItemValue = (value: string, formik: any, valueIndex: number) => {
  let formikValuePath: string = '';
  let formikField: string = '';

  if (formik.values.profileType === ProfileTypes.FreshMeasurement) {
    formikValuePath = `${FRESH_MEASUREMRNT_VALUES_FORM_FIELD}[${valueIndex}].value`;
    formikField = FRESH_MEASUREMRNT_VALUES_FORM_FIELD;
  } else if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    formikValuePath = `${BASE_MEASUREMRNT_VALUES_FORM_FIELD}[${valueIndex}].value`;
    formikField = BASE_MEASUREMRNT_VALUES_FORM_FIELD;
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    debugger;
    console.log('TODO: ProfileTypes.BodyMeasurement on set value');
  } else {
    debugger;
    console.log('TODO: Handle unknown ProfileTypes on set  value');
  }

  formik.setFieldValue(formikValuePath, value);
  formik.setFieldTouched(formikField);
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
              props.valueModel.value !== props.valueModel.initValue
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
                      props.index
                    )}
                    onChange={(args: any) => {
                      _onSetItemValue(
                        args?.target?.value ? args.target.value : '',
                        props.formik,
                        props.index
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
