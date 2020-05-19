import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  Toggle,
  PrimaryButton,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, OptionUnit } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

export class ManagingProductUnitFormInitValues {
  constructor() {
    this.value = '';
    this.imageUrl = '';
    this.isMandatory = false;
    this.file = null;
  }

  value: string;
  imageUrl: string;
  isMandatory: boolean;
  file: any;
}

const buildOptionUnit = (
  values: ManagingProductUnitFormInitValues,
  sourceEntity?: OptionUnit
) => {
  let newUnit: OptionUnit;

  if (sourceEntity) {
    newUnit = { ...sourceEntity };
  } else {
    newUnit = new OptionUnit();
  }

  newUnit.value = values.value;
  newUnit.imageUrl = values.imageUrl;
  newUnit.isMandatory = values.isMandatory;

  let FOO_FOO = {
    unit: newUnit,
    file: values.file,
  };

  return FOO_FOO;
};

const initDefaultValues = (sourceEntity?: OptionUnit | null) => {
  const initValues = new ManagingProductUnitFormInitValues();

  if (sourceEntity) {
    initValues.value = sourceEntity.value;
    initValues.imageUrl = sourceEntity.imageUrl;
    initValues.isMandatory = sourceEntity.isMandatory;
  }

  return initValues;
};

export class ManagingProductUnitFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.optionUnit = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  optionUnit?: OptionUnit | null;
  submitAction: (args: any) => void;
}

export const ManagingProductUnitForm: React.FC<ManagingProductUnitFormProps> = (
  props: ManagingProductUnitFormProps
) => {
  const initValues = initDefaultValues(props.optionUnit);

  const fileInputRef: any = React.createRef();

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          value: Yup.string().required(() => 'Value is required'),
          isMandatory: Yup.boolean(),
          file: Yup.object().nullable(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(
            buildOptionUnit(values, props.optionUnit as OptionUnit)
          );
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          props.formikReference.formik = formik;
          if (props.formikReference.isDirtyFunc)
            props.formikReference.isDirtyFunc(formik.dirty);

          console.log(formik);

          let thumb: any = null;

          if (formik.values.file) {
            thumb = (
              <img
                width="100px"
                height="100px"
                alt=""
                src={URL.createObjectURL(formik.values.file)}
              />
            );
          }

          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="value">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.value}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Value"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('value', value);
                              formik.setFieldTouched('value');
                            }}
                            errorMessage={
                              formik.errors.value && formik.touched.value ? (
                                <span className="form__group__error">
                                  {formik.errors.value}
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

                    <Field name="file">
                      {() => {
                        return (
                          <div className="form__group">
                            <div style={{ position: 'relative' }}>
                              <input
                                accept="image/*"
                                ref={fileInputRef}
                                style={{
                                  height: '1px',
                                  width: '1px',
                                  position: 'absolute',
                                }}
                                type="file"
                                onChange={(args: any) => {
                                  let file = args.currentTarget.files;
                                  debugger;
                                  if (file && file.length && file.length > 0) {
                                    formik.setFieldValue('file', file[0]);
                                  }
                                }}
                              />
                              <PrimaryButton
                                text="Primary"
                                onClick={() => {
                                  debugger;
                                  if (formik.values.file) {
                                    if (fileInputRef && fileInputRef.current) {
                                      if (
                                        fileInputRef.current &&
                                        document.createEvent
                                      ) {
                                        debugger;
                                        fileInputRef.current.value = '';
                                        formik.setFieldValue('file', null);
                                      }
                                    }
                                  } else {
                                    if (fileInputRef && fileInputRef.current) {
                                      if (
                                        fileInputRef.current &&
                                        document.createEvent
                                      ) {
                                        let evt = document.createEvent(
                                          'MouseEvents'
                                        );
                                        evt.initEvent('click', true, false);
                                        fileInputRef.current.dispatchEvent(evt);
                                      }
                                    }
                                  }
                                }}
                                allowDisabledFocus
                              />
                            </div>
                            {thumb}
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

export default ManagingProductUnitForm;
