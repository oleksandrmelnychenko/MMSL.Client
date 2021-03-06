import React from 'react';
import {
  Stack,
  Text,
  TextField,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import './valueItem.scss';
import { Field } from 'formik';
import {
  Measurement,
  MeasurementMapDefinition,
} from '../../../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  CustomerProfileSizeValue,
  ProfileTypes,
} from '../../../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import { mainTitleHintContent } from '../../../../../../../common/fabric-styles/styles';
import { MEASUREMENT_VALUES_FORM_FIELD } from '../../ProfileForm';

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
              resultItem.value =
                profileValue.value !== null && profileValue.value !== undefined
                  ? `${profileValue.value}`
                  : '';
              resultItem.fittingValue =
                profileValue.fittingValue !== null &&
                profileValue.fittingValue !== undefined
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

  if (
    profileType === ProfileTypes.BaseMeasurement ||
    profileType === ProfileTypes.BodyMeasurement
  ) {
    result = `${MEASUREMENT_VALUES_FORM_FIELD}.${valueIndex}`;
  } else {
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

  if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    result = formik.values.measurementValues[valueIndex].value;
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    if (isBodySizeOffset)
      result = formik.values.measurementValues[valueIndex].fittingValue;
    else result = formik.values.measurementValues[valueIndex].value;
  } else {
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

  if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    formikValuePath = `${MEASUREMENT_VALUES_FORM_FIELD}[${valueIndex}].value`;
    formikField = MEASUREMENT_VALUES_FORM_FIELD;
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    if (isBodySizeOffset) {
      formikValuePath = `${MEASUREMENT_VALUES_FORM_FIELD}[${valueIndex}].fittingValue`;
      formikField = MEASUREMENT_VALUES_FORM_FIELD;
    } else {
      formikValuePath = `${MEASUREMENT_VALUES_FORM_FIELD}[${valueIndex}].value`;
      formikField = MEASUREMENT_VALUES_FORM_FIELD;
    }
  } else {
    console.log('TODO: Handle unknown ProfileTypes on set  value');
  }

  formik.setFieldValue(formikValuePath, value);
  formik.setFieldTouched(formikField);
};

const _resolveIsDirty = (valueModel: IInputValueModel, formik: any) => {
  let result: boolean = false;

  if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    result =
      valueModel.fittingValue !== valueModel.initFittingValue ||
      valueModel.value !== valueModel.initValue;
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
}

export const ValueItem: React.FC<IValueItemProps> = (
  props: IValueItemProps
) => {
  let componentClassName = _resolveIsDirty(props.valueModel, props.formik)
    ? 'valueItem isDirty'
    : 'valueItem';

  if (props.formik.values.profileType === ProfileTypes.BodyMeasurement)
    componentClassName += ' fittingValueItem';

  return (
    <>
      <Field
        name={_buildFieldName(props.formik.values.profileType, props.index)}
      >
        {() => (
          <div className={componentClassName}>
            <Stack
              tokens={{ childrenGap: '12px' }}
              horizontal
              horizontalAlign="space-between"
            >
              <Stack.Item
                className={'valueItem__text'}
                grow={2}
                styles={{
                  root: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <TooltipHost
                  id={`unitItem_${props.valueModel.id}`}
                  calloutProps={{ gapSpace: 0 }}
                  delay={TooltipDelay.zero}
                  directionalHint={DirectionalHint.bottomCenter}
                  styles={{ root: { display: 'inline-block' } }}
                  content={props.valueModel.definitionName}
                >
                  <Text block nowrap styles={{ root: { width: '70px' } }}>
                    {props.valueModel.definitionName}
                  </Text>
                </TooltipHost>
              </Stack.Item>

              <Stack.Item grow={1} className={'valueItem__sizeMeasurement'}>
                <Stack>
                  <>
                    {props.formik.values.profileType ===
                    ProfileTypes.BodyMeasurement ? (
                      <Text variant="small" styles={mainTitleHintContent}>
                        {'Body'}
                      </Text>
                    ) : null}
                  </>

                  <div className="valueItem__editNameInput">
                    <TextField
                      autoComplete={false ? 'on' : 'off'}
                      type="number"
                      borderless
                      value={_extractCurrentValueFromFormik(
                        props.formik,
                        props.index,
                        false
                      )}
                      onChange={(args: any) => {
                        _onSetItemValue(
                          args?.target?.value ? args.target.value : '',
                          props.formik,
                          props.index,
                          false
                        );
                      }}
                    />
                  </div>
                </Stack>
              </Stack.Item>

              {
                <>
                  {props.formik.values.profileType ===
                  ProfileTypes.BodyMeasurement ? (
                    <Stack.Item
                      grow={1}
                      className={'valueItem__fittingMeasurement'}
                    >
                      <Stack>
                        <Text variant="small" styles={mainTitleHintContent}>
                          {'Allowance'}
                        </Text>
                        <div className="valueItem__editNameInput">
                          <TextField
                            autoComplete={false ? 'on' : 'off'}
                            type="number"
                            borderless
                            value={_extractCurrentValueFromFormik(
                              props.formik,
                              props.index,
                              true
                            )}
                            onChange={(args: any) => {
                              _onSetItemValue(
                                args?.target?.value ? args.target.value : '',
                                props.formik,
                                props.index,
                                true
                              );
                            }}
                          />
                        </div>
                      </Stack>
                    </Stack.Item>
                  ) : null}
                </>
              }
            </Stack>
          </div>
        )}
      </Field>
    </>
  );
};

export default ValueItem;
