import React from 'react';
import { Field } from 'formik';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';

export interface IFormDropdownProps {
  formik: any;
  fieldName: string;
  label: string;
  options: IDropdownOption[];

  resolveSelectedKeyValue: (formValue: any) => string;
  resolveOnChangeValue: (option: IDropdownOption | null | undefined) => any;
}

const _resolveSelectedKey = (props: IFormDropdownProps) => {
  let selectedKeyResult = props.resolveSelectedKeyValue(
    props.formik.values[props.fieldName]
  );

  return selectedKeyResult;
};

export const FormDropdown: React.FC<IFormDropdownProps> = (
  props: IFormDropdownProps
) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <Dropdown
            selectedKey={_resolveSelectedKey(props)}
            className="form__group__field"
            label={props.label}
            options={props.options}
            styles={fabricStyles.dropDownStyles}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              option?: any
            ) => {
              const resolvedValue = props.resolveOnChangeValue(option);

              props.formik.setFieldValue(props.fieldName, resolvedValue);
              props.formik.setFieldTouched(props.fieldName);
            }}
          />
        </div>
      )}
    </Field>
  );
};

export default FormDropdown;
