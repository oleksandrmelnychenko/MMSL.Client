import React from 'react';
import { FieldArray } from 'formik';
import {
  Measurement,
  MeasurementMapDefinition,
} from '../../../../../interfaces/measurements';
import { ProfileTypes } from '../ProfileTypeInput';
import {
  CustomerProductProfile,
  CustomerProfileSizeValue,
} from '../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';
import { FRESH_MEASUREMRNT_VALUES_FORM_FIELD } from '../OrderMeasurementsForm';

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
          measurementDefinitionId: mapDefinition.id,
          definitionName: mapDefinition.measurementDefinition
            ? mapDefinition.measurementDefinition.name
            : '',
          id: 0,
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
            }
          }
        }

        return resultItem;
      })
      .toArray();
  }

  return result;
};

export interface IFreshMeasurementInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const FreshMeasurementInput: React.FC<IFreshMeasurementInputProps> = (
  props: IFreshMeasurementInputProps
) => {
  return (
    <>
      {props.formik.values.profileType === ProfileTypes.FreshMeasurement &&
      props.formik.values.measurementId !== 0 ? (
        <FieldArray name={FRESH_MEASUREMRNT_VALUES_FORM_FIELD}>
          {(arrayHelper: any) => {
            return (
              <Stack
                styles={{ root: { marginTop: '20px !important' } }}
                tokens={{ childrenGap: '6px' }}
              >
                <Separator alignContent="start">Fresh measurement</Separator>

                {props.formik.values.freshMeasuremrntValues.map(
                  (valueModel: IInputValueModel, index: number) => {
                    return (
                      <ValueItem
                        key={index}
                        index={index}
                        formik={props.formik}
                        valueModel={valueModel}
                      />
                    );
                  }
                )}
              </Stack>
            );
          }}
        </FieldArray>
      ) : null}
    </>
  );
};

export default FreshMeasurementInput;
