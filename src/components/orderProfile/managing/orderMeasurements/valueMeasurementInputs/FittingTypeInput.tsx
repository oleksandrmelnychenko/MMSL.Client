import React, { useState, useEffect } from 'react';
import { Field } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import { FittingType } from '../../../../../interfaces/measurements';
import { useDispatch } from 'react-redux';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { ProfileTypes } from '../ProfileTypeInput';
import { FITTING_TYPE_ID_FORM_FIELD } from '../OrderMeasurementsForm';

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

export const FittingTypeInput: React.FC<IFittingTypeInputProps> = (
  props: IFittingTypeInputProps
) => {
  const dispatch = useDispatch();

  const [measurementId, setMeasurementId] = useState<number>(0);
  const [fittingTypes, setFittingTypes] = useState<FittingType[]>([]);

  if (props.formik.values.measurementId !== measurementId)
    setMeasurementId(props.formik.values.measurementId);

  useEffect(() => {
    if (measurementId !== 0) {
      dispatch(
        assignPendingActions(
          fittingTypesActions.apiGetFittingTypesByMeasurementId(measurementId),
          [],
          [],
          (args: any) => {
            setFittingTypes(args);
          },
          (args: any) => {
            setFittingTypes([]);
          }
        )
      );
    } else {
      setFittingTypes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementId]);

  return (
    <>
      {props.formik.values.profileType === ProfileTypes.BodyMeasurement ? (
        <Field name={FITTING_TYPE_ID_FORM_FIELD}>
          {() => (
            <Dropdown
              selectedKey={`${props.formik.values.fittingTypeId}`}
              label="Fitting type"
              options={_buildOptions(fittingTypes)}
              styles={fabricStyles.comboBoxStyles}
              onChange={(
                event: React.FormEvent<HTMLDivElement>,
                option?: IDropdownOption,
                index?: number
              ) => {
                if (option) {
                  props.formik.setFieldValue(
                    FITTING_TYPE_ID_FORM_FIELD,
                    (option as any).fittingType.id
                  );
                  props.formik.setFieldTouched(FITTING_TYPE_ID_FORM_FIELD);
                } else {
                  props.formik.setFieldValue(FITTING_TYPE_ID_FORM_FIELD, 0);
                  props.formik.setFieldTouched(FITTING_TYPE_ID_FORM_FIELD);
                }
              }}
            />
          )}
        </Field>
      ) : null}
    </>
  );
};

export default FittingTypeInput;
