import React from 'react';
import { FieldArray } from 'formik';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../interfaces/orderProfile';
import { Stack, Text } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';
import { BODY_MEASUREMRNT_VALUES_FORM_FIELD } from '../OrderMeasurementsForm';
import FittingTypeInput from './FittingTypeInput';

export interface IBodyMeasurementInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

const _measurementLabelsStyle = { root: { color: '#b6b6b6' } };

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

            <Stack.Item grow={1}>
              <Stack tokens={{ childrenGap: '3px' }}>
                {/* <Separator alignContent="start">Body measurement</Separator> */}
                <Stack
                  horizontal
                  tokens={{ childrenGap: '176px' }}
                  styles={{ root: { marginLeft: '120px' } }}
                >
                  <Text block styles={_measurementLabelsStyle}>
                    Fresh
                  </Text>
                  <Text block styles={_measurementLabelsStyle}>
                    Body
                  </Text>
                </Stack>
                <FieldArray name={BODY_MEASUREMRNT_VALUES_FORM_FIELD}>
                  {(arrayHelper: any) => {
                    return (
                      <Stack tokens={{ childrenGap: '6px' }}>
                        {props.formik.values.bodyMeasuremrntValues.map(
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
