import React from 'react';
import { Field } from 'formik';
import { Dropdown, IDropdownOption, TextField } from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';
import { List } from 'linq-typescript';

export interface IFormDropdownProps {
  formik: any;
  fieldName: string;
  label: string;
  options: IDropdownOption[];
  readOnly?: boolean;

  resolveSelectedKeyValue: (formValue: any) => string;
  resolveOnChangeValue: (option: IDropdownOption | null | undefined) => any;
}

const _resolveSelectedKey = (props: IFormDropdownProps) => {
  let selectedKeyResult = props.resolveSelectedKeyValue(
    props.formik.values[props.fieldName]
  );

  return selectedKeyResult;
};

const _renderAsReadOnly = (props: IFormDropdownProps) => {
  let selectedKey = _resolveSelectedKey(props);
  const selectedOption: IDropdownOption | null | undefined = new List(
    props.options
  ).firstOrDefault((option: IDropdownOption) => option.key === selectedKey);

  let result = (
    <div className="form__group">
      <TextField
        readOnly={true}
        autoComplete={'off'}
        value={selectedOption ? selectedOption.text : ''}
        styles={fabricStyles.textFildLabelStyles}
        className="form__group__field"
        label={props.label}
      />
    </div>
  );

  return result;
};

const _renderAsEditable = (props: IFormDropdownProps) => {
  let result = (
    <div className="form__group">
      <Dropdown
        selectedKey={_resolveSelectedKey(props)}
        className="form__group__field"
        label={props.label}
        options={props.options}
        styles={fabricStyles.dropDownStyles}
        onChange={(event: React.FormEvent<HTMLDivElement>, option?: any) => {
          const resolvedValue = props.resolveOnChangeValue(option);

          props.formik.setFieldValue(props.fieldName, resolvedValue);
          props.formik.setFieldTouched(props.fieldName);
        }}
      />
    </div>
  );

  return result;
};

export const FormDropdown: React.FC<IFormDropdownProps> = (
  props: IFormDropdownProps
) => {
  return (
    <Field name={props.fieldName}>
      {() =>
        props.readOnly ? _renderAsReadOnly(props) : _renderAsEditable(props)
      }
    </Field>
  );
};

export default FormDropdown;
