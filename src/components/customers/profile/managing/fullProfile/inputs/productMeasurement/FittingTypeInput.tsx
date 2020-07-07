import React, { useState, useEffect } from 'react';
import { Field } from 'formik';
import { IDropdownOption, ComboBox, IComboBox } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import { FittingType } from '../../../../../../../interfaces/measurements';
import { useDispatch } from 'react-redux';
import { fittingTypesActions } from '../../../../../../../redux/slices/measurements/fittingTypes.slice';
import { assignPendingActions } from '../../../../../../../helpers/action.helper';
import { List } from 'linq-typescript';
import { IInputValueModel, resolveInitialValue } from './ValueItem';
import { ProfileTypes } from '../../../../../../../interfaces/orderProfile';
import {
  FITTING_TYPE_ID_FORM_FIELD,
  MEASUREMENT_VALUES_FORM_FIELD,
} from '../../ProfileForm';

export interface IFittingTypeInputProps {
  formik: any;
}

const _buildOptions = (fittingTypes: FittingType[]) => {
  return fittingTypes.map((fittingType: FittingType, index: number) => {
    return {
      key: `${fittingType.id}`,
      text: fittingType.type,
      fittingType: fittingType,
    } as IDropdownOption;
  });
};

const _applyOffsetSizeValues = (
  fittingType: FittingType | null | undefined,
  formik: any
) => {
  if (fittingType?.measurementMapValues) {
    if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
      const syncCharts = formik.values.measurementValues.map(
        (valueItem: IInputValueModel, index: number) => {
          const fittingTypeValue = new List(
            fittingType?.measurementMapValues
              ? fittingType.measurementMapValues
              : []
          ).firstOrDefault(
            (item) =>
              item.measurementDefinitionId === valueItem.measurementDefinitionId
          );

          if (fittingTypeValue) {
            valueItem.fittingValue = `${fittingTypeValue.value}`;
          }

          valueItem.initFittingValue = valueItem.fittingValue;
          resolveInitialValue(valueItem, formik, true);

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

export const FittingTypeInput: React.FC<IFittingTypeInputProps> = (
  props: IFittingTypeInputProps
) => {
  const dispatch = useDispatch();

  const [measurementId, setMeasurementId] = useState<number>(0);
  const [fittingTypeId, setFittingTypeId] = useState<number>(0);
  const [fittingTypeOptions, setFittingTypeOptions] = useState<any[]>([]);

  if (props.formik.values.measurementId !== measurementId)
    setMeasurementId(props.formik.values.measurementId);

  if (props.formik.values.fittingTypeId !== fittingTypeId)
    setFittingTypeId(props.formik.values.fittingTypeId);

  useEffect(() => {
    if (measurementId !== 0) {
      dispatch(
        assignPendingActions(
          fittingTypesActions.apiGetFittingTypesByMeasurementId(measurementId),
          [],
          [],
          (args: any) => {
            const options = _buildOptions(args);

            setFittingTypeOptions(options);
          },
          (args: any) => {
            setFittingTypeOptions([]);
          }
        )
      );
    } else {
      setFittingTypeOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementId]);

  useEffect(() => {
    return () => {
      props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.BodyMeasurement ? (
        <Field name={FITTING_TYPE_ID_FORM_FIELD}>
          {() => (
            <div className="form__group">
              <ComboBox
                selectedKey={`${props.formik.values.fittingTypeId}`}
                label="Fitting type"
                placeholder={'Choose fitting type'}
                style={{ width: '300px' }}
                allowFreeform={false}
                options={fittingTypeOptions}
                styles={fabricStyles.comboBoxStyles}
                onChange={(
                  event: React.FormEvent<IComboBox>,
                  option?: any,
                  index?: number,
                  value?: string
                ) => {
                  let fittingTypeId = option ? option.fittingType.id : 0;

                  props.formik.setFieldValue(
                    FITTING_TYPE_ID_FORM_FIELD,
                    fittingTypeId
                  );
                  props.formik.setFieldTouched(FITTING_TYPE_ID_FORM_FIELD);

                  _applyOffsetSizeValues(
                    new List(fittingTypeOptions).firstOrDefault(
                      (option) => option.fittingType.id === fittingTypeId
                    )?.fittingType,
                    props.formik
                  );
                }}
              />
              {props.formik.errors.fittingTypeId &&
              props.formik.touched.fittingTypeId ? (
                <span className="form__group__error formFieldError">
                  {props.formik.errors.fittingTypeId}
                </span>
              ) : null}
            </div>
          )}
        </Field>
      ) : null}
    </>
  );
};

export default FittingTypeInput;
