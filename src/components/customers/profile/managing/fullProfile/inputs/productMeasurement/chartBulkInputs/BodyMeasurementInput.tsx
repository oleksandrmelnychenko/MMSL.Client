import React from 'react';
import { FieldArray } from 'formik';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../../interfaces/orderProfile';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from '../ValueItem';
import { MEASUREMENT_VALUES_FORM_FIELD } from '../../../ProfileForm';

export interface IBodyMeasurementInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const BodyMeasurementInput: React.FC<IBodyMeasurementInputProps> = (
  props: IBodyMeasurementInputProps
) => {
  return (
    <>
      {props.formik.values.profileType === ProfileTypes.BodyMeasurement &&
      props.formik.values.measurementId !== 0 ? (
        <>
          <Stack tokens={{ childrenGap: '12px' }}>
            <Stack.Item grow={1}>
              <Stack tokens={{ childrenGap: '3px' }}>
                <Separator alignContent="start">Columns</Separator>
                <FieldArray name={MEASUREMENT_VALUES_FORM_FIELD}>
                  {(arrayHelper: any) => {
                    return (
                      <Stack horizontal wrap tokens={{ childrenGap: '6px' }}>
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
                    );
                  }}
                </FieldArray>
              </Stack>
            </Stack.Item>
          </Stack>
        </>
      ) : null}
    </>
  );
};

export default BodyMeasurementInput;
