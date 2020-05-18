import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Toggle } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, ProductGroup } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

export class ManagingProductGroupFormInitValues {
  constructor() {
    this.name = '';
    this.isMandatory = false;
  }

  name: string;
  isMandatory: boolean;
}

const buildProductGroup = (
  values: ManagingProductGroupFormInitValues,
  sourceEntity?: ProductGroup
) => {
  let newGroup: ProductGroup;

  if (sourceEntity) {
    newGroup = { ...sourceEntity };
  } else {
    newGroup = new ProductGroup();
    newGroup.productUnits = [];
  }

  newGroup.name = values.name;
  newGroup.isMandatory = values.isMandatory;

  return newGroup;
};

const initDefaultValues = (sourceEntity?: ProductGroup | null) => {
  const initValues = new ManagingProductGroupFormInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.isMandatory = sourceEntity.isMandatory;
  }

  return initValues;
};

class ManagingProductGroupFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.productGroupToEdit = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  productGroupToEdit?: ProductGroup | null;
  submitAction: (args: any) => void;
}

export const ManagingProductGroupForm: React.FC<ManagingProductGroupFormProps> = (
  props: ManagingProductGroupFormProps
) => {
  const initValues = initDefaultValues(props.productGroupToEdit);

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
            buildProductGroup(values, props.productGroupToEdit as ProductGroup)
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

export default ManagingProductGroupForm;
