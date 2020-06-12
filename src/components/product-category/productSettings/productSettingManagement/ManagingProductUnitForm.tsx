import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  FontIcon,
  mergeStyles,
  Label,
  DefaultButton,
} from 'office-ui-fabric-react';
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
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import { List } from 'linq-typescript';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { ProductCategory } from '../../../../interfaces/products';

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

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.New, () => {
            formikReference.formik.resetForm();
            dispatch(
              productSettingsActions.toggleOptionUnitFormVisibility(true)
            );
            dispatch(productSettingsActions.changeTargetOptionunit(null));
          }),
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            console.log('-1->');
            console.log(formikReference.formik.values);
            formikReference.formik.resetForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Delete, () => {
            // formikReference.formik.submitForm();
            if (formikReference.formik.values.unitToDelete) {
              console.log('---> Delete unit');
              console.log(formikReference.formik.values.unitToDelete);
              dispatch(
                controlActions.toggleCommonDialogVisibility(
                  new DialogArgs(
                    CommonDialogType.Delete,
                    'Delete option unit',
                    `Are you sure you want to delete ${formikReference.formik.values.unitToDelete.value}?`,
                    () => {
                      dispatch(
                        assignPendingActions(
                          productSettingsActions.deleteOptionUnitById(
                            formikReference.formik.values.unitToDelete.id
                          ),
                          [
                            productSettingsActions.changeTargetOptionunit(null),
                            productSettingsActions.toggleOptionUnitFormVisibility(
                              false
                            ),
                          ],
                          [],
                          (args: any) => {
                            if (targetProduct?.id) {
                              dispatch(
                                assignPendingActions(
                                  productSettingsActions.apiGetAllOptionGroupsByProductIdList(
                                    targetProduct.id
                                  ),
                                  [],
                                  [],
                                  (args: any) => {
                                    dispatch(
                                      productSettingsActions.updateOptionGroupList(
                                        args
                                      )
                                    );
                                  },
                                  (args: any) => {}
                                )
                              );
                            }
                          }
                        )
                      );
                    },
                    () => {}
                  )
                )
              );
            }
          }),
        ])
      );
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

  const onUpdate = (values: IInitValues) => {
    if (targetProduct && sectedOptionGroupId) {
      const payload = _buildUpdatedUnitPayload(values, values.unitToDelete);

      dispatch(
        assignPendingActions(
          productSettingsActions.apiUpdateOptionUnit(payload),
          [
            productSettingsActions.changeTargetOptionunit(null),
            productSettingsActions.toggleOptionUnitFormVisibility(false),
          ],
          [],
          (successResponseArgs: any) => {
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
        )
      );
    }
  };

  const createNew = (values: IInitValues) => {
    if (targetProduct && sectedOptionGroupId) {
      const payload = _buildNewUnitPayload(values, sectedOptionGroupId);

      dispatch(
        assignPendingActions(
          productSettingsActions.apiCreateNewOptionUnit(payload),
          [
            productSettingsActions.changeTargetOptionunit(null),
            productSettingsActions.toggleOptionUnitFormVisibility(false),
          ],
          [],
          (successResponseArgs: any) => {
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
        )
      );
    }
  };

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
          unitToDelete: Yup.object().nullable(),
        })}
        initialValues={_initDefaultValues(sectedOptionUnit)}
        onSubmit={(values: any) => {
          if (values.unitToDelete) onUpdate(values);
          else createNew(values);
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;

          if (formik) {
            let isDirty: boolean = _isFormikDirty(
              formik.initialValues,
              formik.values
            );

            setFormikIsDirty(isDirty);

            console.log('-2->');
            console.log(formikReference.formik.values);
            setDismissIsDirty(formik.values.unitToDelete ? true : false);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          let thumbUrl: string = '';
          if (formik.values.isRemovingImage) {
            if (sectedOptionUnit) {
              if (formik.values.imageFile) {
                thumbUrl = URL.createObjectURL(formik.values.imageFile);
              } else {
                thumbUrl = sectedOptionUnit.imageUrl;
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

          const renderResult = isUnitFormVisible ? (
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
          ) : (
            _renderHintLable('Select and explore or define new style unit.')
          );

          return renderResult;
        }}
      </Formik>
    </div>
  );
};

export default ManagingProductUnitForm;
