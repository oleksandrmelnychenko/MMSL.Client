import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  ProductCategory,
  ProductPermissionSettings,
} from '../../../../interfaces';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../redux/reducers';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../../redux/slices/productStylePermissions.slice';

class InitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const _buildNewPayload = (
  values: InitValues,
  productCategory: ProductCategory
) => {
  let payload: any = {
    name: values.name,
    description: values.description,
    productCategoryId: productCategory.id,
    permissionSettings: [],
    id: 0,
  };

  return payload;
};

const _buildEditedPayload = (
  values: InitValues,
  sourceEntity: ProductPermissionSettings
) => {
  let payload: any = {};

  return payload;
};

const _initDefaultValues = (
  sourceEntity?: ProductPermissionSettings | null
) => {
  const initValues: InitValues = new InitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

export const ProductPermissionForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const productCategory = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const editingSetting = useSelector<
    IApplicationState,
    ProductPermissionSettings | null | undefined
  >((state) => state.productStylePermissions.editingPermissionSetting);

  const permissionSettings: ProductPermissionSettings[] = useSelector<
    IApplicationState,
    ProductPermissionSettings[]
  >((state) => state.productStylePermissions.permissionSettings);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
  }, [formikReference, dispatch]);

  useEffect(() => {
    if (new List(commandBarItems).any()) {
      dispatch(
        controlActions.setPanelButtons(
          ChangeItemsDisabledState(
            commandBarItems,
            [CommandBarItem.Reset, CommandBarItem.Save],
            !isFormikDirty
          )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty, dispatch]);

  const editSetting = (values: InitValues) => {
    if (productCategory && editingSetting) {
      const payload = _buildEditedPayload(values, editingSetting);
      /// TODO: use appropriate api and build flow
    }
  };

  const createNewSetting = (values: InitValues) => {
    if (productCategory) {
      const payload = _buildNewPayload(values, productCategory);
      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiCreateNewPermission(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              productStylePermissionsActions.updatePermissionSettingsList(
                new List(permissionSettings).concat([args.body]).toArray()
              )
            );
            dispatch(controlActions.closeRightPanel());
            dispatch(
              productStylePermissionsActions.changeEditingPermissionSetting(
                null
              )
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  return (
    <div className="productPermissionForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          description: Yup.string(),
        })}
        initialValues={_initDefaultValues(editingSetting)}
        onSubmit={(values: any) => {
          if (editingSetting) editSetting(values);
          else createNewSetting(values);
        }}
        onReset={(values: any, formikHelpers: any) => {}}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik) setFormikDirty(formik.dirty);
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack>
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
                            formik.setFieldValue('name', args.target.value);
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
                          onChange={(args: any) => {
                            formik.setFieldValue(
                              'description',
                              args.target.value
                            );
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
                </Stack>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductPermissionForm;
