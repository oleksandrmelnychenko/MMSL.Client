import React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../common/fabric-styles/styles';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../../../../redux/reducers';
import {
  MeasurementUnit,
  Measurement,
} from '../../../../../../interfaces/measurements';
import { List } from 'linq-typescript';

export interface IUnitOfMeasurementInputProps {
  formik: any;
  measurement: Measurement | null | undefined;
}

const _resolveDefaultSelectedOptionKey = (
  options: IDropdownOption[],
  unitOfMeasurementId: number
) => {
  let defaultSelectKey: string = '';

  const unitToSelect = new List(options).firstOrDefault(
    (option) => option.key === `${unitOfMeasurementId}`
  );

  if (unitToSelect) {
    defaultSelectKey = `${unitToSelect.key}`;
  } else {
    if (options.length > 0) defaultSelectKey = `${options[0].key}`;
  }

  return defaultSelectKey;
};

export const UnitOfMeasurementInput: React.FC<IUnitOfMeasurementInputProps> = (
  props: IUnitOfMeasurementInputProps
) => {
  const unitsOfMeasurement = useSelector<IApplicationState, MeasurementUnit[]>(
    (state) => state.unitsOfMeasurement.unitsOfMeasurement
  );

  const unitOptions = unitsOfMeasurement.map(
    (unit: MeasurementUnit, index: number) => {
      return {
        key: `${unit.id}`,
        text: unit.description,
        isSelected: unit.id === props.formik.values.unitOfMeasurementId,
        unitOfMeasurement: unit,
      } as IDropdownOption;
    }
  );

  return (
    <div className="form__group">
      <Dropdown
        defaultSelectedKey={_resolveDefaultSelectedOptionKey(
          unitOptions,
          props.formik.values.unitOfMeasurementId
        )}
        placeholder="Choose Unit of Measurement"
        label="Unit of measurement"
        options={unitOptions}
        styles={fabricStyles.comboBoxStyles}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption,
          index?: number
        ) => {
          if (option) {
            props.formik.setFieldValue(
              'unitOfMeasurementId',
              (option as any).unitOfMeasurement.id
            );
            props.formik.setFieldTouched('unitOfMeasurementId');
          }
        }}
      />
    </div>
  );
};

export default UnitOfMeasurementInput;
