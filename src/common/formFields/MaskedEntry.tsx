import React from 'react';
import { Field } from 'formik';
import { MaskedTextField } from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';

export interface IMaskedEntryProps {
  formik: any;
  fieldName: string;
  label: string;
  mask: string;
  isRequired: boolean;
}

export const MaskedEntry: React.FC<IMaskedEntryProps> = (
  props: IMaskedEntryProps
) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <MaskedTextField
            autoComplete={'off'}
            value={props.formik.values[props.fieldName]}
            styles={fabricStyles.textFildLabelStyles}
            className="form__group__field"
            label={props.label}
            required={props.isRequired}
            onChange={(args: any) => {
              let value = args.target.value;

              props.formik.setFieldValue(props.fieldName, value);
              props.formik.setFieldTouched(props.fieldName);
            }}
            mask={props.mask}
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

export default MaskedEntry;
