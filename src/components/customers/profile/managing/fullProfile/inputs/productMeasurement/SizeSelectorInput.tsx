import React, { useEffect, useState } from 'react';
import { Field } from 'formik';
import {
  Measurement,
  MeasurementMapSize,
} from '../../../../../../../interfaces/measurements';
import {
  CustomerProductProfile,
  ProfileTypes,
} from '../../../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import { ComboBox, IComboBoxOption, IComboBox } from 'office-ui-fabric-react';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../../../../../helpers/action.helper';
import { measurementActions } from '../../../../../../../redux/slices/measurements/measurement.slice';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import { IInputValueModel, resolveInitialValue } from './ValueItem';
import {
  MEASUREMENT_SIZE_ID_FORM_FIELD,
  MEASUREMENT_VALUES_FORM_FIELD,
} from '../../ProfileForm';

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

const _applySizeValues = (
  mapSize: MeasurementMapSize | null | undefined,
  formik: any
) => {
  if (mapSize?.measurementSize?.measurementMapValues) {
    if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
      const syncCharts = formik.values.measurementValues.map(
        (valueItem: IInputValueModel, index: number) => {
          const sizeValue = new List(
            mapSize?.measurementSize?.measurementMapValues
              ? mapSize.measurementSize.measurementMapValues
              : []
          ).firstOrDefault(
            (item) =>
              item.measurementDefinitionId === valueItem.measurementDefinitionId
          );

          if (sizeValue) valueItem.value = `${sizeValue.value}`;

          valueItem.initValue = valueItem.value;
          resolveInitialValue(valueItem, formik, false);

          return valueItem;
        }
      );

      formik.setFieldValue(MEASUREMENT_VALUES_FORM_FIELD, syncCharts);
      formik.setFieldTouched(MEASUREMENT_VALUES_FORM_FIELD);
    }
  } else {
    /// TODO:
  }
};

export interface ISizeSelectorInputProps {
  formik: any;
  orderProfile: CustomerProductProfile | null | undefined;
}

export const SizeSelectorInput: React.FC<ISizeSelectorInputProps> = (
  props: ISizeSelectorInputProps
) => {
  const dispatch = useDispatch();

  const [measurementId, setMeasurementId] = useState<number>(0);
  const [sizeMapId, setSizeMapId] = useState<number>(0);

  const [sizeOptions, setSizeOptions] = useState<any[]>([]);

  if (measurementId !== props.formik.values.measurementId)
    setMeasurementId(props.formik.values.measurementId);

  if (sizeMapId !== props.formik.values.measurementSizeId)
    setSizeMapId(props.formik.values.measurementSizeId);

  useEffect(() => {
    if (measurementId !== 0) {
      dispatch(
        assignPendingActions(
          measurementActions.apiGetMeasurementById(measurementId),
          [],
          [],
          (args: any) => {
            const options = _buildSizeOptions(args);

            // props.formik.setFieldValue(
            //   MEASUREMENT_SIZE_ID_FORM_FIELD,
            //   _resolveSelectedId(options, props.formik.values.measurementSizeId)
            // );
            // props.formik.setFieldTouched(MEASUREMENT_SIZE_ID_FORM_FIELD);

            setSizeOptions(options);

            // _applySizeValues(
            //   new List(sizeOptions).firstOrDefault(
            //     (option) => option.sizeMap.id === sizeMapId
            //   )?.sizeMap,
            //   props.formik
            // );
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
  }, [measurementId]);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.BaseMeasurement ? (
        <Field name={MEASUREMENT_SIZE_ID_FORM_FIELD}>
          {(arrayHelper: any) => {
            return (
              <ComboBox
                selectedKey={`${props.formik.values.measurementSizeId}`}
                allowFreeform={false}
                label="Size"
                placeholder={'Choose size'}
                style={{ width: '300px' }}
                autoComplete={true ? 'on' : 'off'}
                options={sizeOptions}
                useComboBoxAsMenuWidth={true}
                styles={{
                  ...fabricStyles.comboBoxStyles,
                  label: {
                    ...fabricStyles.comboBoxStyles.label,
                  },
                }}
                onChange={(
                  event: React.FormEvent<IComboBox>,
                  option?: any,
                  index?: number,
                  value?: string
                ) => {
                  let sizeId = option ? option.sizeMap.id : 0;

                  props.formik.setFieldValue(
                    MEASUREMENT_SIZE_ID_FORM_FIELD,
                    sizeId
                  );
                  props.formik.setFieldTouched(MEASUREMENT_SIZE_ID_FORM_FIELD);

                  _applySizeValues(
                    new List(sizeOptions).firstOrDefault(
                      (option) => option.sizeMap.id === sizeId
                    )?.sizeMap,
                    props.formik
                  );
                }}
              />
            );
          }}
        </Field>
      ) : null}
    </>
  );
};

export default SizeSelectorInput;
