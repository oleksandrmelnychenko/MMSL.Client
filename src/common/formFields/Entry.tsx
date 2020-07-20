import React from 'react';
import { Field } from 'formik';
import { TextField } from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';

export interface IEntryProps {
  formik: any;
  fieldName: string;
  label: string;
  isRequired: boolean;
  isNumber?: boolean;
}

export const Entry: React.FC<IEntryProps> = (props: IEntryProps) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <TextField
            type={props.isNumber ? 'number' : undefined}
            autoComplete={'off'}
            value={props.formik.values[props.fieldName]}
            styles={fabricStyles.textFildLabelStyles}
            className="form__group__field"
            required={props.isRequired}
            label={props.label}
            onChange={(args: any) => {
              let value = args.target.value;

              props.formik.setFieldValue(props.fieldName, value);
              props.formik.setFieldTouched(props.fieldName);
            }}
            errorMessage={
              props.formik.errors[props.fieldName] &&
              props.formik.touched[props.fieldName] ? (
                <span className="form__group__error">
                  {props.formik.errors[props.fieldName]}
                </span>
              ) : (
                ''
              )
            }
          />
        </div>
      )}
    </Field>
  );
};

export default Entry;
