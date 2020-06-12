import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Checkbox } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import '../../../dealers/dealerManaging/manageDealerForm.scss';
import { FormicReference } from '../../../../interfaces';
import { OptionGroup } from '../../../../interfaces/options';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../redux/slices/control.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { List } from 'linq-typescript';
import { IApplicationState } from '../../../../redux/reducers';
import { ProductCategory } from '../../../../interfaces/products';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';

interface IInitValues {
  name: string;
  isMandatory: boolean;
}

const _buildNewPayload = (values: IInitValues, product: ProductCategory) => {
  let payload = {
    productId: product.id,
    name: values.name,
    isMandatory: values.isMandatory,
  };

  return payload;
};

const _buildUpdatedPayload = (
  values: IInitValues,
  sourceEntity: OptionGroup
) => {
  let payload = { ...sourceEntity };
  payload.name = values.name;
  payload.isMandatory = values.isMandatory;

  return payload;
};

const _initDefaultValues = (sourceEntity?: OptionGroup | null) => {
  const initValues: IInitValues = { name: '', isMandatory: false };

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.isMandatory = sourceEntity.isMandatory;
  }

  return initValues;
};

export const ManagingvOptionGroupForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const targetProduct: ProductCategory | null | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.product.choose.category);

  const editingGroup: OptionGroup | null | undefined = useSelector<
    IApplicationState,
    OptionGroup | null | undefined
  >((state) => state.productSettings.editingOptionGroup);

  /// Disposing form
  useEffect(() => {
    return () => {
      dispatch(productSettingsActions.changeEditingGroup(null));
    };
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

  const editGroup = (values: IInitValues) => {
    if (targetProduct && editingGroup) {
      const payload = _buildUpdatedPayload(values, editingGroup);
      dispatch(
        assignPendingActions(
          productSettingsActions.apiUpdateOptionGroup(payload),
          [],
          [],
          () => {
            dispatch(
              assignPendingActions(
                productSettingsActions.apiGetAllOptionGroupsByProductIdList(
                  targetProduct.id
                ),
                [],
                [],
                (args: any) => {
                  dispatch(productSettingsActions.updateOptionGroupList(args));
                  dispatch(controlActions.closeRightPanel());
                  dispatch(productSettingsActions.changeEditingGroup(null));
                },
                (args: any) => {}
              )
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const createNewGroup = (values: IInitValues) => {
    if (targetProduct) {
      const payload = _buildNewPayload(values, targetProduct);
      dispatch(
        assignPendingActions(
          productSettingsActions.apiCreateOptionGroup(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              assignPendingActions(
                productSettingsActions.apiGetAllOptionGroupsByProductIdList(
                  targetProduct.id
                ),
                [],
                [],
                (args: any) => {
                  dispatch(productSettingsActions.updateOptionGroupList(args));
                  dispatch(controlActions.closeRightPanel());
                  dispatch(productSettingsActions.changeEditingGroup(null));
                },
                (args: any) => {}
              )
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          isMandatory: Yup.boolean(),
        })}
        initialValues={_initDefaultValues(editingGroup)}
        onSubmit={(values: any) => {
          if (editingGroup) editGroup(values);
          else createNewGroup(values);
        }}
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
