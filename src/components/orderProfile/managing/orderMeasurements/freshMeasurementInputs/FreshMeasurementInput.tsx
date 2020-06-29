import React, { useState, useEffect } from 'react';
import { FieldArray } from 'formik';
import {
  Measurement,
  MeasurementMapDefinition,
} from '../../../../../interfaces/measurements';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { ProfileTypes } from '../ProfileTypeInput';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';
import {
  CustomerProductProfile,
  CustomerProfileSizeValue,
} from '../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';

const _initInputValueModelDefaults = (
  measurement: Measurement,
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
  const dispatch = useDispatch();

  // const [measurementId, setMeasurementId] = useState<number>(0);
  const [profileType, setProfileType] = useState<ProfileTypes>(
    ProfileTypes.FreshMeasurement
  );

  // if (props.formik.values.measurementId !== measurementId)
  //   setMeasurementId(props.formik.values.measurementId);

  // if (props.formik.values.profileType !== profileType)
  //   setProfileType(props.formik.values.profileType);

  // useEffect(() => {
  //   return () => {
  //     setMeasurementId(0);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (
  //     measurementId !== 0 &&
  //     props.formik.values.profileType === ProfileTypes.FreshMeasurement
  //   ) {
  //     dispatch(
  //       assignPendingActions(
  //         measurementActions.apiGetMeasurementById(measurementId),
  //         [],
  //         [],
  //         (args: any) => {
  //           const items = _initInputValueModelDefaults(
  //             args,
  //             props.orderProfile
  //           );

  //           props.formik.setFieldValue('TEST', items);
  //         },
  //         (args: any) => {
  //           props.formik.setFieldValue('TEST', []);
  //         }
  //       )
  //     );
  //   } else {
  //     props.formik.setFieldValue('TEST', []);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [measurementId, profileType]);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.FreshMeasurement &&
      props.formik.values.TEST ? (
        <FieldArray name="TEST">
          {(arrayHelper: any) => {
            return (
              <Stack
                styles={{ root: { marginTop: '20px !important' } }}
                tokens={{ childrenGap: '6px' }}
              >
                <Separator alignContent="start">Fresh measurement</Separator>

                {props.formik.values.TEST.map(
                  (valueModel: IInputValueModel, index: number) => {
                    return (
                      <ValueItem
                        key={index}
                        fieldName={'TEST'}
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
