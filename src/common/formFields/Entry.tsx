import React, { useState, useRef, useEffect } from 'react';
import { Field } from 'formik';
import { TextField } from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';

export interface IEntryProps {
  formik: any;
  fieldName: string;
  label: string;
  isRequired: boolean;
  isNumber?: boolean;
  readOnly?: boolean;
  regExpString?: string;
}

export const Entry: React.FC<IEntryProps> = (props: IEntryProps) => {
  // const emailRegex: RegExp = new RegExp(`^[^>#<&?.4:;@"/|'!*]+$`);

  const [regExperssion, setRegExperssion] = useState<RegExp | null>(null);

  useEffect(() => {
    if (props.regExpString && props.regExpString.length > 0) {
      setRegExperssion(new RegExp(props.regExpString));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <TextField
            readOnly={props.readOnly}
            type={props.isNumber ? 'number' : undefined}
            autoComplete={'off'}
            value={props.formik.values[props.fieldName]}
            styles={fabricStyles.textFildLabelStyles}
            className="form__group__field"
            required={props.isRequired}
            label={props.label}
            onChange={(args: any) => {
              let isValid: boolean = true;
              const value = args?.target?.value ? args.target.value : '';

              debugger;
              if (regExperssion) {
                isValid = regExperssion.test(value);
              }

              if (isValid) {
                props.formik.setFieldValue(props.fieldName, value);
                props.formik.setFieldTouched(props.fieldName);
              }
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
