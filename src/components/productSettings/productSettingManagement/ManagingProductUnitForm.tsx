import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  Checkbox,
  FontIcon,
  mergeStyles,
  DefaultButton,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, OptionUnit } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

export class ManagingProductUnitFormInitValues {
  constructor() {
    this.value = '';
    this.isMandatory = false;
    this.imageFile = null;
    this.isRemovingImage = false;
    this.imageUrl = '';
  }

  value: string;
  imageUrl: string;
  isMandatory: boolean;
  imageFile: any | null;
  isRemovingImage: boolean;
}

const buildOptionUnit = (
  values: ManagingProductUnitFormInitValues,
  relativeOptionGroupId: number | null | undefined,
  sourceEntity?: OptionUnit
) => {
  let newUnit: OptionUnit;

  if (sourceEntity) {
    newUnit = { ...sourceEntity };
  } else {
    newUnit = new OptionUnit();
    newUnit.optionGroupId = relativeOptionGroupId;
  }

  newUnit.value = values.value;
  newUnit.isMandatory = values.isMandatory;

  if (!values.isRemovingImage) {
    newUnit.imageBlob = null;
    newUnit.imageUrl = '';
  } else {
    newUnit.imageBlob = values.imageFile;
  }

  return newUnit;
};

const initDefaultValues = (sourceEntity?: OptionUnit | null) => {
  const initValues = new ManagingProductUnitFormInitValues();

  if (sourceEntity) {
    initValues.value = sourceEntity.value;
    initValues.isMandatory = sourceEntity.isMandatory;
    initValues.isRemovingImage =
      sourceEntity.imageBlob !== null && sourceEntity.imageBlob !== undefined;
    initValues.imageUrl = sourceEntity.imageUrl;

    if (initValues.imageUrl && initValues.imageUrl.length > 0) {
      initValues.isRemovingImage = true;
    }
  }

  return initValues;
};

export class ManagingProductUnitFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.optionUnit = null;
    this.relativeOptionGroupId = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  optionUnit?: OptionUnit | null;
  relativeOptionGroupId: number | null | undefined;
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
          value: Yup.string()
            .min(3)
            .required(() => 'Value is required'),
          isMandatory: Yup.boolean(),
          imageFile: Yup.object().nullable(),
          isRemovingImage: Yup.boolean(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(
            buildOptionUnit(
              values,
              props.relativeOptionGroupId,
              props.optionUnit as OptionUnit
            )
          );
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
          let thumbUrl: string = '';
          if (formik.values.isRemovingImage) {
            if (props.optionUnit) {
              if (formik.values.imageFile) {
                thumbUrl = URL.createObjectURL(formik.values.imageFile);
              } else {
                thumbUrl = props.optionUnit.imageUrl;
              }
            } else {
              if (formik.values.imageFile) {
                thumbUrl = URL.createObjectURL(formik.values.imageFile);
              }
            }
          }

          const thumb: any = (
            <div
              style={{
                position: 'relative',
                border: '1px solid #efefef',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <FontIcon
                style={{
                  position: 'absolute',
                  top: 'calc(50% - 18px)',
                  left: 'calc(50% - 12px)',
                  zIndex: 0,
                }}
                iconName="FileImage"
                className={mergeStyles({
                  fontSize: 24,
                  width: 24,
                  color: '#cfcfcf',
                })}
              />
              <img
                style={{
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  margin: '0 auto',
                }}
                width="300px"
                height="300px"
                alt=""
                src={thumbUrl}
              />
            </div>
          );

          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1} tokens={{ childrenGap: 20 }}>
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
                            <Checkbox
                              checked={formik.values.isMandatory}
                              label="Allow"
                              onChange={(checked: any, isChecked: any) => {
                                formik.setFieldValue('isMandatory', isChecked);
                                formik.setFieldTouched('isMandatory');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="imageFile">
                      {() => {
                        return (
                          <div className="form__group">
                            <Stack tokens={{ childrenGap: 10 }}>
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
                                    if (
                                      file &&
                                      file.length &&
                                      file.length > 0
                                    ) {
                                      formik.setFieldValue(
                                        'imageFile',
                                        file[0]
                                      );
                                      formik.setFieldValue(
                                        'isRemovingImage',
                                        true
                                      );

                                      args.currentTarget.value = '';
                                    }
                                  }}
                                />
                                <DefaultButton
                                  iconProps={{ iconName: 'Attach' }}
                                  styles={fabricStyles.btnUploadStyle}
                                  text={
                                    formik.values.isRemovingImage
                                      ? 'Delete attach'
                                      : 'Attach'
                                  }
                                  onClick={() => {
                                    const clearInputFileFlow = () => {
                                      if (
                                        fileInputRef &&
                                        fileInputRef.current
                                      ) {
                                        if (fileInputRef.current) {
                                          fileInputRef.current.value = '';
                                          formik.setFieldValue(
                                            'imageFile',
                                            null
                                          );
                                          formik.setFieldValue(
                                            'isRemovingImage',
                                            false
                                          );
                                        }
                                      }
                                    };

                                    const addInputFileFlow = () => {
                                      if (
                                        fileInputRef &&
                                        fileInputRef.current
                                      ) {
                                        if (
                                          fileInputRef.current &&
                                          document.createEvent
                                        ) {
                                          let evt = document.createEvent(
                                            'MouseEvents'
                                          );
                                          evt.initEvent('click', true, false);
                                          fileInputRef.current.dispatchEvent(
                                            evt
                                          );
                                        }
                                      }
                                    };

                                    if (formik.values.isRemovingImage) {
                                      clearInputFileFlow();
                                    } else {
                                      if (formik.values.imageFile) {
                                        clearInputFileFlow();
                                      } else {
                                        addInputFileFlow();
                                      }
                                    }
                                  }}
                                  allowDisabledFocus
                                />
                              </div>

                              {formik.values.isRemovingImage ? thumb : null}
                            </Stack>
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
