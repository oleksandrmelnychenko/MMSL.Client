import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Label } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import { OptionUnit } from '../../../../interfaces/options';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../../redux/slices/control.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledStatePartialy,
} from '../../../../helpers/commandBar.helper';
import {
  productSettingsActions,
  ManagingOptionUnitsState,
} from '../../../../redux/slices/productSettings.slice';
import { List } from 'linq-typescript';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { ProductCategory } from '../../../../interfaces/products';
import AttachField from './AttachField';

export interface IInitValues {
  value: string;
  imageUrl: string;
  isMandatory: boolean;
  imageFile: any | null;
  isRemovingImage: boolean;
  unitToDelete: any;
}

const _buildNewUnitPayload = (
  values: IInitValues,
  relativeOptionGroupId: number
) => {
  let newUnit: OptionUnit = new OptionUnit();
  newUnit.optionGroupId = relativeOptionGroupId;
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

const _buildUpdatedUnitPayload = (
  values: IInitValues,
  sourceEntity: OptionUnit
) => {
  let newUnit: OptionUnit = { ...sourceEntity };

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

/// Build single hint lable
const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

const _initDefaultValues = (sourceEntity?: OptionUnit | null) => {
  const initValues = {
    value: '',
    imageUrl: '',
    isMandatory: false,
    imageFile: null,
    isRemovingImage: false,
    unitToDelete: sourceEntity,
  };

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

const _isFormikDirty = (initValues: IInitValues, values: IInitValues) => {
  let isDirty = false;

  if (initValues && values) {
    isDirty =
      initValues.value !== values.value ||
      initValues.imageUrl !== values.imageUrl ||
      initValues.isMandatory !== values.isMandatory ||
      initValues.imageFile !== values.imageFile ||
      initValues.isRemovingImage !== values.isRemovingImage;
  }

  return isDirty;
};

export const ManagingProductUnitForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [formikIsDirty, setFormikIsDirty] = useState<boolean>(false);
  const [dismissIsDirty, setDismissIsDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const sectedOptionUnit: OptionUnit | null = useSelector<
    IApplicationState,
    OptionUnit | null
  >(
    (state) => state.productSettings.managingOptionUnitsState.selectedOptionUnit
  );

  const sectedOptionGroupId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >(
    (state) =>
      state.productSettings.managingOptionUnitsState.targetOptionGroup?.id
  );

  const isUnitFormVisible: boolean = useSelector<IApplicationState, boolean>(
    (state) =>
      state.productSettings.managingOptionUnitsState.isOptionUnitFormVisible
  );

  const isEditingSingleUnit: boolean = useSelector<IApplicationState, boolean>(
    (state) =>
      state.productSettings.managingOptionUnitsState.isEditingSingleUnit
  );

  useEffect(() => {
    return () => {
      dispatch(
        productSettingsActions.changeManagingOptionUnitsState(
          new ManagingOptionUnitsState()
        )
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formikReference.formik) {
      if (isEditingSingleUnit) {
        dispatch(
          controlActions.setPanelButtons([
            GetCommandBarItemProps(CommandBarItem.Save, () =>
              formikReference.formik.submitForm()
            ),
            GetCommandBarItemProps(CommandBarItem.Reset, () =>
              formikReference.formik.resetForm()
            ),
          ])
        );
      } else {
        dispatch(
          controlActions.setPanelButtons([
            GetCommandBarItemProps(CommandBarItem.New, () => {
              formikReference.formik.resetForm();

              dispatch(
                productSettingsActions.toggleOptionUnitFormVisibility(true)
              );
              dispatch(productSettingsActions.changeTargetOptionUnit(null));
            }),
            GetCommandBarItemProps(CommandBarItem.Save, () =>
              formikReference.formik.submitForm()
            ),
            GetCommandBarItemProps(CommandBarItem.Reset, () =>
              formikReference.formik.resetForm()
            ),
            GetCommandBarItemProps(CommandBarItem.Delete, () => onDeleteUnit()),
          ])
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikReference]);

  useEffect(() => {
    if (formikReference.formik) {
      formikReference.formik.setFieldValue('unitToDelete', sectedOptionUnit);
      formikReference.formik.setFieldTouched('unitToDelete');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikReference, sectedOptionUnit]);

  useEffect(() => {
    if (new List(commandBarItems).any()) {
      dispatch(
        controlActions.setPanelButtons(
          ChangeItemsDisabledStatePartialy(commandBarItems, [
            { command: CommandBarItem.New, isDisabled: false },
            { command: CommandBarItem.Reset, isDisabled: !formikIsDirty },
            { command: CommandBarItem.Save, isDisabled: !formikIsDirty },
            { command: CommandBarItem.Delete, isDisabled: !dismissIsDirty },
          ])
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikIsDirty, dismissIsDirty]);

  const onUpdateUnit = (values: IInitValues) => {
    if (targetProduct && values.unitToDelete) {
      const payload = _buildUpdatedUnitPayload(values, values.unitToDelete);

      dispatch(
        assignPendingActions(
          productSettingsActions.apiUpdateOptionUnit(payload),
          [],
          [],
          (successResponseArgs: any) => {
            if (isEditingSingleUnit) {
              dispatch(controlActions.closeRightPanel());
              dispatch(
                productSettingsActions.changeManagingOptionUnitsState(
                  new ManagingOptionUnitsState()
                )
              );
            } else {
              dispatch(productSettingsActions.changeTargetOptionUnit(null));
              dispatch(
                productSettingsActions.toggleOptionUnitFormVisibility(false)
              );
            }

            refreshTargetProductState();
          }
        )
      );
    }
  };

  const onCreateNewUnit = (values: IInitValues) => {
    if (targetProduct && sectedOptionGroupId) {
      const payload = _buildNewUnitPayload(values, sectedOptionGroupId);

      dispatch(
        assignPendingActions(
          productSettingsActions.apiCreateNewOptionUnit(payload),
          [
            productSettingsActions.changeTargetOptionUnit(null),
            productSettingsActions.toggleOptionUnitFormVisibility(false),
          ],
          [],
          (successResponseArgs: any) => {
            formikReference.formik.resetForm();

            refreshTargetProductState();
          }
        )
      );
    }
  };

  const onDeleteUnit = () => {
    if (formikReference.formik.values.unitToDelete) {
      dispatch(
        controlActions.toggleCommonDialogVisibility(
          new DialogArgs(
            CommonDialogType.Delete,
            'Delete option unit',
            `Are you sure you want to delete ${formikReference.formik.values.unitToDelete.value}?`,
            () => {
              dispatch(
                assignPendingActions(
                  productSettingsActions.apiDeleteOptionUnitById(
                    formikReference.formik.values.unitToDelete.id
                  ),
                  [
                    productSettingsActions.changeTargetOptionUnit(null),
                    productSettingsActions.toggleOptionUnitFormVisibility(
                      false
                    ),
                  ],
                  [],
                  (args: any) => {
                    refreshTargetProductState();
                  }
                )
              );
            },
            () => {}
          )
        )
      );
    }
  };

  const refreshTargetProductState = () => {
    if (targetProduct?.id) {
      dispatch(
        assignPendingActions(
          productSettingsActions.apiGetAllOptionGroupsByProductIdList(
            targetProduct.id
          ),
          [],
          [],
          (args: any) => {
            dispatch(productSettingsActions.updateOptionGroupList(args));
          },
          (args: any) => {}
        )
      );
    }
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        value: Yup.string()
          .min(3)
          .required(() => 'Value is required'),
        isMandatory: Yup.boolean(),
        imageFile: Yup.object().nullable(),
        isRemovingImage: Yup.boolean(),
        unitToDelete: Yup.object().nullable(),
      })}
      initialValues={_initDefaultValues(sectedOptionUnit)}
      onSubmit={(values: any) => {
        if (values.unitToDelete) onUpdateUnit(values);
        else onCreateNewUnit(values);
      }}
      innerRef={(formik: any) => {
        formikReference.formik = formik;

        if (formik) {
          let isDirty: boolean = _isFormikDirty(
            formik.initialValues,
            formik.values
          );

          setFormikIsDirty(isDirty);

          setDismissIsDirty(formik.values.unitToDelete ? true : false);
        }
      }}
      validateOnBlur={false}
      enableReinitialize={true}
    >
      {(formik) => {
        return isUnitFormVisible ? (
          <Form>
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

              <AttachField formik={formik} />
            </Stack>
          </Form>
        ) : (
          _renderHintLable('Select and explore or define new style unit.')
        );
      }}
    </Formik>
  );
};

export default ManagingProductUnitForm;
