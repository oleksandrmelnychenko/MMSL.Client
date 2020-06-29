import React, { useEffect, useState } from 'react';
import { FieldArray, Field } from 'formik';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
} from '../../../../../interfaces/measurements';
import { ProfileTypes } from '../ProfileTypeInput';
import {
  CustomerProductProfile,
  CustomerProfileSizeValue,
} from '../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import {
  Stack,
  Separator,
  ComboBox,
  IComboBoxOption,
  IComboBox,
} from 'office-ui-fabric-react';
import ValueItem, { IInputValueModel } from './ValueItem';
import {
  FRESH_MEASUREMRNT_VALUES_FORM_FIELD,
  MEASUREMENT_SIZE_ID_FORM_FIELD,
} from '../OrderMeasurementsForm';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';

const _buildSizeOptions = (measurement: Measurement) => {
  let result: IComboBoxOption[] = [];

  if (measurement?.measurementMapSizes) {
    result = new List(measurement.measurementMapSizes)
      .select((size: MeasurementMapSize) => {
        return {
          key: `${size.id}`,
          text: `${size.measurementSize ? size.measurementSize.name : ''}`,
          sizeMap: size,
        } as IComboBoxOption;
      })
      .toArray();
  }

  return result;
};

const _resolveSelectedId = (
  sizeOptions: IComboBoxOption[],
  idToSelect: number
) => {
  let result: number =
    sizeOptions.length > 0 ? (sizeOptions[0] as any).sizeMap.id : 0;

  const targetOption = new List(sizeOptions).firstOrDefault(
    (option: IComboBoxOption) => option.key === `${idToSelect}`
  );

  if (targetOption) {
    result = (targetOption as any).sizeMap.id;
  }

  return result;
};

export interface IBaseMeasurementInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const BaseMeasurementInput: React.FC<IBaseMeasurementInputProps> = (
  props: IBaseMeasurementInputProps
) => {
  const dispatch = useDispatch();

  const [measurementId, setMeasurementId] = useState<number>(0);
  const [profileType, setProfileType] = useState<ProfileTypes>(
    ProfileTypes.BaseMeasurement
  );
  const [sizeOptions, setSizeOptions] = useState<any[]>([]);

  if (measurementId !== props.formik.values.measurementId)
    setMeasurementId(props.formik.values.measurementId);

  if (profileType !== props.formik.values.profileType)
    setProfileType(props.formik.values.profileType);

  useEffect(() => {
    if (
      measurementId !== 0 &&
      props.formik.values.profileType === ProfileTypes.BaseMeasurement
    ) {
      dispatch(
        assignPendingActions(
          measurementActions.apiGetMeasurementById(measurementId),
          [],
          [],
          (args: any) => {
            const options = _buildSizeOptions(args);

            props.formik.setFieldValue(
              MEASUREMENT_SIZE_ID_FORM_FIELD,
              _resolveSelectedId(options, props.formik.values.measurementSizeId)
            );
            props.formik.setFieldTouched(MEASUREMENT_SIZE_ID_FORM_FIELD);
            setSizeOptions(options);
          },
          (args: any) => {
            setSizeOptions([]);
          }
        )
      );
    } else {
      setSizeOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementId, profileType]);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.BaseMeasurement &&
      props.formik.values.measurementId !== 0 ? (
        <>
          <Stack
            styles={{ root: { marginTop: '20px !important' } }}
            tokens={{ childrenGap: '12px' }}
          >
            <Separator alignContent="start">Base measurement</Separator>

            <Field name={MEASUREMENT_SIZE_ID_FORM_FIELD}>
              {(arrayHelper: any) => {
                return (
                  <ComboBox
                    selectedKey={`${props.formik.values.measurementSizeId}`}
                    allowFreeform={true}
                    label="Size"
                    autoComplete={true ? 'on' : 'off'}
                    options={sizeOptions}
                    useComboBoxAsMenuWidth={true}
                    styles={{
                      ...fabricStyles.comboBoxStyles,
                      label: {
                        ...fabricStyles.comboBoxStyles.label,
                        paddingTop: '0px',
                      },
                    }}
                    onChange={(
                      event: React.FormEvent<IComboBox>,
                      option?: any,
                      index?: number,
                      value?: string
                    ) => {
                      let sizeId = 0;

                      if (option?.sizeMap) sizeId = option.sizeMap.id;

                      props.formik.setFieldValue(
                        MEASUREMENT_SIZE_ID_FORM_FIELD,
                        sizeId
                      );
                      props.formik.setFieldTouched(
                        MEASUREMENT_SIZE_ID_FORM_FIELD
                      );
                    }}
                    onPendingValueChanged={(
                      option?: any,
                      index?: number,
                      value?: string
                    ) => {}}
                  />
                );
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
