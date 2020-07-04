import React, { useEffect, useState } from 'react';
import { List } from 'linq-typescript';
import { IComboBoxOption, Dropdown } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../../../common/fabric-styles/styles';
import { IStyleUnitModel, updateIsUnitDirty } from './StyleUnitItem';
import { UnitValue } from '../../../../../../../interfaces/options';
import { STYLE_UNITS_VALUES_FORM_FIELD } from '../../../fullProfile/ProfileForm';

export interface IUnitValueSelectorInputProps {
  formik: any;
  unitModel: IStyleUnitModel;
}

const _buildUnitValueOptions = (unitModel: IStyleUnitModel) => {
  let result: IComboBoxOption[] = [];

  if (unitModel.possibleValues) {
    result = new List(unitModel.possibleValues)
      .select((unitValue: UnitValue) => {
        return {
          key: `${unitValue.id}`,
          text: `${unitValue.value}`,
          unitValue: unitValue,
        } as IComboBoxOption;
      })
      .toArray();
  }

  return result;
};

export const UnitValueSelectorInput: React.FC<IUnitValueSelectorInputProps> = (
  props: IUnitValueSelectorInputProps
) => {
  const [unitId, setUnitId] = useState<number>(0);
  const [unitValueOptions, setUnitValueOptions] = useState<any[]>([]);

  if (unitId !== props.unitModel.optionUnitId)
    setUnitId(props.unitModel.optionUnitId);

  useEffect(() => {
    setUnitValueOptions(_buildUnitValueOptions(props.unitModel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  return (
    <Dropdown
      selectedKey={`${props.unitModel.selectedStyleValueId}`}
      options={unitValueOptions}
      disabled={unitValueOptions.length === 0}
      styles={fabricStyles.comboBoxStyles}
      onChange={(
        event: React.FormEvent<HTMLDivElement>,
        option?: any,
        index?: number
      ) => {
        props.unitModel.selectedStyleValueId = option ? option.unitValue.id : 0;
        updateIsUnitDirty(props.unitModel, props.formik);

        props.formik.setFieldValue(`${STYLE_UNITS_VALUES_FORM_FIELD}`, [
          ...props.formik.values.productStyleValues,
        ]);

        props.formik.setFieldTouched(
          `${STYLE_UNITS_VALUES_FORM_FIELD}[${props.unitModel.index}]`
        );
      }}
    />
  );
};

export default UnitValueSelectorInput;
