import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Toggle } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, OptionGroup } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

export class ManagingOptionGroupFormInitValues {
  constructor() {
    this.name = '';
    this.isMandatory = false;
  }

  name: string;
  isMandatory: boolean;
}

const buildOptionGroup = (
  values: ManagingOptionGroupFormInitValues,
  sourceEntity?: OptionGroup
) => {
  let newGroup: OptionGroup;

  if (sourceEntity) {
    newGroup = { ...sourceEntity };
  } else {
    newGroup = new OptionGroup();
    newGroup.optionUnits = [];
  }

  newGroup.name = values.name;
  newGroup.isMandatory = values.isMandatory;

  return newGroup;
};

const initDefaultValues = (sourceEntity?: OptionGroup | null) => {
  const initValues = new ManagingOptionGroupFormInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.isMandatory = sourceEntity.isMandatory;
  }

  return initValues;
};

class ManagingvOptionGroupFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.OptionGroupToEdit = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  OptionGroupToEdit?: OptionGroup | null;
  submitAction: (args: any) => void;
}

export const ManagingvOptionGroupForm: React.FC<ManagingvOptionGroupFormProps> = (
  props: ManagingvOptionGroupFormProps
) => {
  const initValues = initDefaultValues(props.OptionGroupToEdit);

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(() => 'Name is required'),
          isMandatory: Yup.boolean(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(
            buildOptionGroup(values, props.OptionGroupToEdit as OptionGroup)
          );
        }}
        validateOnBlur={false}
      >
        {(formik) => {
          props.formikReference.formik = formik;
          if (props.formikReference.isDirtyFunc)
            props.formikReference.isDirtyFunc(formik.dirty);

          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="name">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.name}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="User name"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('name', value);
                              formik.setFieldTouched('name');
                            }}
                            errorMessage={
                              formik.errors.name && formik.touched.name ? (
                                <span className="form__group__error">
                                  {formik.errors.name}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="isMandatory">
                      {() => {
                        return (
                          <div className="form__group">
                            <Toggle
                              checked={formik.values.isMandatory}
                              styles={fabricStyles.toggleStyles}
                              className="form__group__field"
                              label="Is mandatory"
                              inlineLabel
                              onText="On"
                              offText="Off"
                              onChange={(checked: any, isChecked: any) => {
                                formik.setFieldValue('isMandatory', isChecked);
                                formik.setFieldTouched('isMandatory');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </Stack>
                </Stack>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ManagingvOptionGroupForm;
