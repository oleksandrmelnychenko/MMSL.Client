import React from 'react';
import { Field } from 'formik';
import { Checkbox } from 'office-ui-fabric-react';

export interface IFormCheckboxProps {
  formik: any;
  fieldName: string;
  label: string;
}

export const FormCheckbox: React.FC<IFormCheckboxProps> = (
  props: IFormCheckboxProps
) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <Checkbox
            checked={props.formik.values[props.fieldName]}
            label={props.label}
            styles={{ root: { marginTop: '20px' } }}
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

export default FormCheckbox;
