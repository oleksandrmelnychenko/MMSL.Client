import React from 'react';
import { Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';

export interface IEntityInputProps {
  formik: any;
}

export const EntityInput: React.FC<IEntityInputProps> = (
  props: IEntityInputProps
) => {
  return (
    <Stack>
      <Field name="name">
        {() => (
          <div className="form__group">
            <TextField
              autoComplete="off"
              value={props.formik.values.name}
              styles={fabricStyles.textFildLabelStyles}
              className="form__group__field"
              label="Name"
              required
              onChange={(args: any) => {
                props.formik.setFieldValue('name', args.target.value);
                props.formik.setFieldTouched('name');
              }}
              errorMessage={
                props.formik.errors.name && props.formik.touched.name ? (
                  <span className="form__group__error">
                    {props.formik.errors.name}
                  </span>
                ) : (
                  ''
                )
              }
            />
          </div>
        )}
      </Field>
      <Field name="description">
        {() => (
          <div className="form__group">
            <TextField
              autoComplete="off"
              value={props.formik.values.description}
              styles={fabricStyles.textFildLabelStyles}
              className="form__group__field"
              label="Description"
              onChange={(args: any) => {
                props.formik.setFieldValue('description', args.target.value);
                props.formik.setFieldTouched('description');
              }}
              errorMessage={
                props.formik.errors.description &&
                props.formik.touched.description ? (
                  <span className="form__group__error">
                    {props.formik.errors.description}
                  </span>
                ) : (
                  ''
                )
              }
            />
          </div>
        )}
      </Field>
    </Stack>
  );
};

export default EntityInput;
