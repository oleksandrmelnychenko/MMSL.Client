import React, { useEffect, useState } from 'react';
import { Field } from 'formik';
import {
  Measurement,
  MeasurementMapSize,
} from '../../../../../interfaces/measurements';
import { ProfileTypes } from '../ProfileTypeInput';
import { CustomerProductProfile } from '../../../../../interfaces/orderProfile';
import { List } from 'linq-typescript';
import { ComboBox, IComboBoxOption, IComboBox } from 'office-ui-fabric-react';
import {
  MEASUREMENT_SIZE_ID_FORM_FIELD,
  BASE_MEASUREMRNT_VALUES_FORM_FIELD,
} from '../OrderMeasurementsForm';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import { IInputValueModel } from './ValueItem';

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

const _applySizeValues = (
  mapSize: MeasurementMapSize | null | undefined,
  formik: any
) => {
  if (mapSize?.measurementSize?.measurementMapValues) {
    if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
      const syncCharts = formik.values.baseMeasuremrntValues.map(
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

          return valueItem;
        }
      );

      formik.setFieldValue(BASE_MEASUREMRNT_VALUES_FORM_FIELD, syncCharts);
      formik.setFieldTouched(BASE_MEASUREMRNT_VALUES_FORM_FIELD);
    }
  } else {
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
  const [profileType, setProfileType] = useState<ProfileTypes>(
    ProfileTypes.BaseMeasurement
  );
  const [sizeOptions, setSizeOptions] = useState<any[]>([]);

  if (measurementId !== props.formik.values.measurementId)
    setMeasurementId(props.formik.values.measurementId);

  if (profileType !== props.formik.values.profileType)
    setProfileType(props.formik.values.profileType);

  if (sizeMapId !== props.formik.values.measurementSizeId)
    setSizeMapId(props.formik.values.measurementSizeId);

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

  useEffect(() => {
    _applySizeValues(
      new List(sizeOptions).firstOrDefault(
        (option) => option.sizeMap.id === sizeMapId
      )?.sizeMap,
      props.formik
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeMapId, sizeOptions]);

  return (
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
              let sizeId = option ? option.sizeMap.id : 0;

              props.formik.setFieldValue(
                MEASUREMENT_SIZE_ID_FORM_FIELD,
                sizeId
              );
              props.formik.setFieldTouched(MEASUREMENT_SIZE_ID_FORM_FIELD);
            }}
          />
        );
      }}
    </Field>
  );
};

export default SizeSelectorInput;
