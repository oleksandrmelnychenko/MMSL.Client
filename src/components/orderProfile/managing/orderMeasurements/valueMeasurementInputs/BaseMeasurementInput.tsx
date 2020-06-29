import React, { useEffect, useState } from 'react';
import { FieldArray, Field } from 'formik';
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
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';

export interface IBaseMeasurementInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const BaseMeasurementInput: React.FC<IBaseMeasurementInputProps> = (
  props: IBaseMeasurementInputProps
) => {
  // const dispatch = useDispatch();

  // const [measurementId, setMeasurementId] = useState<number>(0);

  // if (measurementId !== props.formik.values.measurementId)
  //   setMeasurementId(props.formik.values.measurementId);

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
  // }, [measurementId]);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.FreshMeasurement &&
      props.formik.values.measurementId !== 0 ? (
        <>
          <Stack
            styles={{ root: { marginTop: '20px !important' } }}
            tokens={{ childrenGap: '12px' }}
          >
            <Separator alignContent="start">Fresh measurement</Separator>

            <Field name={FRESH_MEASUREMRNT_VALUES_FORM_FIELD}>
              {(arrayHelper: any) => {
                return <div>{'Sizes dropdown'}</div>;
              }}
            </Field>

            {/* <Stack
              styles={{ root: { marginTop: '20px !important' } }}
              tokens={{ childrenGap: '6px' }}
            >
              <Separator alignContent="start">Fresh measurement</Separator>

              <FieldArray name={FRESH_MEASUREMRNT_VALUES_FORM_FIELD}>
                {(arrayHelper: any) => {
                  return (
                    <Stack tokens={{ childrenGap: '6px' }}>
                      {props.formik.values.freshMeasuremrntValues.map(
                        (valueModel: IInputValueModel, index: number) => {
                          return (
                            <ValueItem
                              key={index}
                              fieldName={FRESH_MEASUREMRNT_VALUES_FORM_FIELD}
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
            </Stack> */}
          </Stack>
        </>
      ) : null}
    </>
  );
};

export default BaseMeasurementInput;
