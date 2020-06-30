import React from 'react';
import { FieldArray } from 'formik';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../interfaces/orderProfile';
import { Stack, Separator } from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';
import { BASE_MEASUREMRNT_VALUES_FORM_FIELD } from '../OrderMeasurementsForm';
import SizeSelectorInput from './SizeSelectorInput';

export interface IBaseMeasurementInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const BaseMeasurementInput: React.FC<IBaseMeasurementInputProps> = (
  props: IBaseMeasurementInputProps
) => {
  return (
    <>
      {props.formik.values.profileType === ProfileTypes.BaseMeasurement &&
      props.formik.values.measurementId !== 0 ? (
        <>
          <Stack
            styles={{ root: { marginTop: '15px !important' } }}
            tokens={{ childrenGap: '12px' }}
          >
            <SizeSelectorInput
              formik={props.formik}
              orderProfile={props.orderProfile}
            />

            <Stack tokens={{ childrenGap: '6px' }}>
              <Separator alignContent="start">Base measurement</Separator>

              <FieldArray name={BASE_MEASUREMRNT_VALUES_FORM_FIELD}>
                {(arrayHelper: any) => {
                  return (
                    <Stack tokens={{ childrenGap: '6px' }}>
                      {props.formik.values.baseMeasuremrntValues.map(
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
          </Stack>
        </>
      ) : null}
    </>
  );
};

export default BaseMeasurementInput;
