import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Checkbox } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import '../../../dealers/dealerManaging/manageDealerForm.scss';
import { FormicReference } from '../../../../interfaces';
import { OptionGroup } from '../../../../interfaces/options';
import * as fabricStyles from '../../../../common/fabric-styles/styles';

export class ManagingOptionGroupFormInitValues {
  constructor() {
    this.name = '';
    this.isMandatory = false;
  }

  name: string;
  isMandatory: boolean;
}

const _buildNewGroupPayload = (
  values: ManagingOptionGroupFormInitValues,
  productId: number
) => {
  let payload = {
    productId: productId,
    name: values.name,
    isMandatory: values.isMandatory,
  };

  return payload;
};

const _buildUpdatedGroupPayload = (
  values: ManagingOptionGroupFormInitValues,
  productId: number,
  sourceEntity: OptionGroup
) => {
  let payload = { ...sourceEntity };
  payload.name = values.name;
  payload.isMandatory = values.isMandatory;

  return payload;
};

const _initDefaultValues = (sourceEntity?: OptionGroup | null) => {
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
    this.productId = 0;
    this.OptionGroupToEdit = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  productId: number;
  OptionGroupToEdit?: OptionGroup | null;
  submitAction: (args: any) => void;
}

export const ManagingvOptionGroupForm: React.FC<ManagingvOptionGroupFormProps> = (
  props: ManagingvOptionGroupFormProps
) => {
  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          isMandatory: Yup.boolean(),
        })}
        initialValues={_initDefaultValues(props.OptionGroupToEdit)}
        onSubmit={(values: any) => {
          const payload = props.OptionGroupToEdit
            ? _buildUpdatedGroupPayload(
                values,
                props.productId,
                props.OptionGroupToEdit
              )
            : _buildNewGroupPayload(values, props.productId);

          props.submitAction(payload);
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;
          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1} tokens={{ childrenGap: 20 }}>
                    <Field name="name">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.name}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Name"
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
                            <Checkbox
                              checked={formik.values.isMandatory}
                              label="Is mandatory"
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
