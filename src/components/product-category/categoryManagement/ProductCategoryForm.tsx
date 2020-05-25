import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  FontIcon,
  mergeStyles,
  DefaultButton,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference, ProductCategory } from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

export class ProductCategoryFormInitValues {
  constructor() {
    this.name = '';
    this.description = '';
    this.imageUrl = '';

    this.imageFile = null;
    this.isRemovingImage = false;
  }

  name: string;
  description: string;
  imageUrl: string;

  imageFile: any | null;
  isRemovingImage: boolean;
}

const buildProductCategory = (
  values: ProductCategoryFormInitValues,
  sourceEntity?: ProductCategory
) => {
  let newUnit: ProductCategory;

  if (sourceEntity) {
    newUnit = { ...sourceEntity };
  } else {
    newUnit = new ProductCategory();
  }

  newUnit.name = values.name;
  newUnit.description = values.description;

  if (!values.isRemovingImage) {
    newUnit.imageBlob = null;
    newUnit.imageUrl = '';
  } else {
    newUnit.imageBlob = values.imageFile;
  }

  return newUnit;
};

const initDefaultValues = (sourceEntity?: ProductCategory | null) => {
  const initValues = new ProductCategoryFormInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
    initValues.imageUrl = sourceEntity.imageUrl;
    initValues.imageFile = sourceEntity.imageBlob;

    if (initValues.imageUrl && initValues.imageUrl.length > 0) {
      initValues.isRemovingImage = true;
    }
  }

  return initValues;
};

export class ProductCategoryFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.submitAction = (args: any) => {};
    this.productCategory = null;
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
  productCategory?: ProductCategory | null;
}

export const ProductCategoryForm: React.FC<ProductCategoryFormProps> = (
  props: ProductCategoryFormProps
) => {
  const initValues = initDefaultValues(props.productCategory);
  const fileInputRef: any = React.createRef();

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          description: Yup.string(),
          imageFile: Yup.object(),
          isRemovingImage: Yup.boolean(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(
            buildProductCategory(
              values,
              props.productCategory as ProductCategory
            )
          );
        }}
        innerRef={(formik: any) => {
          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          props.formikReference.formik = formik;

          let thumbUrl: string = '';
          if (formik.values.isRemovingImage) {
            if (props.productCategory) {
              if (formik.values.imageFile) {
                thumbUrl = URL.createObjectURL(formik.values.imageFile);
              } else {
                thumbUrl = props.productCategory.imageUrl;
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
                  <Stack grow={1}>
                    <Field name="name">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.name}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Value"
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

                    <Field name="description">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.description}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Description"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('description', value);
                              formik.setFieldTouched('description');
                            }}
                            errorMessage={
                              formik.errors.description &&
                              formik.touched.description ? (
                                <span className="form__group__error">
                                  {formik.errors.description}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>

                    <Field name="imageFile">
                      {() => {
                        return (
                          <div className="form__group">
                            <Stack tokens={{ childrenGap: 10 }}>
                              <div
                                style={{
                                  marginTop: '20px',
                                  position: 'relative',
                                }}
                              >
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

export default ProductCategoryForm;
