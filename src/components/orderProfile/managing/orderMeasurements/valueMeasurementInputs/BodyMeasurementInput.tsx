import React from 'react';
import { FieldArray } from 'formik';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../interfaces/orderProfile';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';
import { BODY_MEASUREMRNT_VALUES_FORM_FIELD } from '../OrderMeasurementsForm';
import FittingTypeInput from './FittingTypeInput';

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
            <FittingTypeInput formik={props.formik} />

            <Stack horizontal tokens={{ childrenGap: '12px' }}>
              <Stack.Item grow={1}>
                <Stack tokens={{ childrenGap: '6px' }}>
                  <Separator alignContent="start">Body measurement</Separator>

                  <FieldArray name={BODY_MEASUREMRNT_VALUES_FORM_FIELD}>
                    {(arrayHelper: any) => {
                      return (
                        <Stack tokens={{ childrenGap: '6px' }}>
                          {props.formik.values.bodyMeasuremrntValues.map(
                            (valueModel: IInputValueModel, index: number) => {
                              return (
                                <ValueItem
                                  isBodySizeOffset={false}
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

              <Stack.Item grow={1}>
                <Stack tokens={{ childrenGap: '6px' }}>
                  <Separator alignContent="start">
                    Body measurement offsets
                  </Separator>

                  <FieldArray name={BODY_MEASUREMRNT_VALUES_FORM_FIELD}>
                    {(arrayHelper: any) => {
                      return (
                        <Stack tokens={{ childrenGap: '6px' }}>
                          {props.formik.values.bodyMeasuremrntValues.map(
                            (valueModel: IInputValueModel, index: number) => {
                              return (
                                <ValueItem
                                  isBodySizeOffset={true}
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
          </Stack>
        </>
      ) : null}
    </>
  );
};

export default BodyMeasurementInput;
