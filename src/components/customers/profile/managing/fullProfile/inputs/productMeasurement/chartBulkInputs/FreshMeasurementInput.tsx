import React from 'react';
import { FieldArray } from 'formik';
import {} from '../../../../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../../interfaces/orderProfile';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from '../ValueItem';
import { MEASUREMENT_VALUES_FORM_FIELD } from '../../../ProfileForm';

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
        <FieldArray name={MEASUREMENT_VALUES_FORM_FIELD}>
          {(arrayHelper: any) => {
            return (
              <Stack tokens={{ childrenGap: '6px' }}>
                <Separator alignContent="start">Columns</Separator>

                <Stack horizontal wrap tokens={{ childrenGap: '9px' }}>
                  {props.formik.values.measurementValues.map(
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
