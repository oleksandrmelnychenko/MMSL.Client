import React from 'react';
import { FieldArray } from 'formik';
import {} from '../../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../interfaces/orderProfile';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';
import { FRESH_MEASUREMRNT_VALUES_FORM_FIELD } from '../OrderMeasurementsForm';

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

                <Stack horizontal wrap tokens={{ childrenGap: '9px' }}>
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
              </Stack>
            );
          }}
        </FieldArray>
      ) : null}
    </>
  );
};

export default FreshMeasurementInput;
