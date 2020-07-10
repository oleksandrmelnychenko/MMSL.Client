import React from 'react';
import { Field } from 'formik';
import * as fabricStyles from '../fabric-styles/styles';
import { Toggle } from 'office-ui-fabric-react';

export interface IFormToggleProps {
  formik: any;
  fieldName: string;
  label: string;
}

export const FormToggle: React.FC<IFormToggleProps> = (
  props: IFormToggleProps
) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <Toggle
            checked={props.formik.values[props.fieldName]}
            className="form__group__field"
            label={props.label}
            styles={fabricStyles.toggleStyles}
            inlineLabel
            onText="On"
            offText="Off"
            onChange={(checked: any, isChecked: any) => {
              props.formik.setFieldValue(props.fieldName, isChecked);
              props.formik.setFieldTouched(props.fieldName);
            }}
          />
        </div>
      )}
    </Field>
  );
};

export default FormToggle;
