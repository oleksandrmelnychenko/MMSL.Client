import React from 'react';
import { Field } from 'formik';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';

export interface IFormComboBoxProps {
  formik: any;
  fieldName: string;
  label: string;
  isRequired: boolean;
  allowFreeform: boolean;
  options: IComboBoxOption[];

  resolveTextHandler: (formValue: any) => string;
  resolveSelectedKeyValue: (formValue: any) => string;
  resolveOnChangeValue: (option: IComboBoxOption | null | undefined) => any;

  onPendingValueChanged: (value: string) => void;
  onChanged: (option: IComboBoxOption | null | undefined) => void;
}

const _resolveText = (props: IFormComboBoxProps) => {
  let textResult = props.resolveTextHandler(
    props.formik.values[props.fieldName]
  );

  return textResult;
};

const _resolveSelectedKey = (props: IFormComboBoxProps) => {
  let selectedKeyResult = props.resolveSelectedKeyValue(
    props.formik.values[props.fieldName]
  );

  return selectedKeyResult;
};

export const FormComboBox: React.FC<IFormComboBoxProps> = (
  props: IFormComboBoxProps
) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <ComboBox
            className="form__group__comboBox"
            text={_resolveText(props)}
            label={props.label}
            selectedKey={_resolveSelectedKey(props)}
            allowFreeform={props.allowFreeform}
            onPendingValueChanged={(
              option?: IComboBoxOption,
              index?: number,
              value?: string
            ) => props.onPendingValueChanged(value ? value : '')}
            onChange={(
              event: any,
              option?: IComboBoxOption,
              index?: number,
              value?: string
            ) => {
              const resolvedValue = props.resolveOnChangeValue(option);

              props.formik.setFieldValue(props.fieldName, resolvedValue);
              props.formik.setFieldTouched(props.fieldName);
              props.onChanged(option);
            }}
            useComboBoxAsMenuWidth
            styles={fabricStyles.comboBoxStyles}
            required={props.isRequired}
            options={props.options}
            errorMessage={
              props.formik.errors[props.fieldName] &&
              props.formik.touched[props.fieldName]
                ? ' '
                : ' '
            }
          />
          {props.formik.errors[props.fieldName] &&
          props.formik.touched[props.fieldName] ? (
            <span className="form__group__error ownError">
              {props.formik.errors[props.fieldName]}
            </span>
          ) : null}
        </div>
      )}
    </Field>
  );
};

export default FormComboBox;
