import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Label } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import {
  OptionUnit,
  UnitValue,
  OptionGroup,
} from '../../../../interfaces/options';
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
import UnitValuesInput, { UnitValueModel } from './UnitValuesInput';
import UnitPriceInput from './price/UnitPriceInput';
import { CurrencyType } from '../../../../interfaces/currencyTypes';

export interface IInitValues {
  value: string;
  imageUrl: string;
  isMandatory: boolean;
  imageFile: any | null;
  isRemovingImage: boolean;
  dirtyValues: UnitValueModel[];
  dirtyValuesToDelete: UnitValueModel[];
  unitToDelete: any;

  priceValue: number;
  priceCurrencyId: number;
}

const _buildNewUnitPayload = (
  values: IInitValues,
  relativeOptionGroupId: number
) => {
  let payload = {
    id: 0,
    orderIndex: 0,
    value: values.value,
    isMandatory: values.isMandatory,
    optionGroupId: relativeOptionGroupId,
    file: values.imageFile,
    serializedValues: values.dirtyValues.map((item) => {
      return {
        value: item.value,
      };
    }),
    price: values.priceValue,
    currencyTypeId: values.priceCurrencyId,
  };

  return payload;
};

const _buildUpdatedUnitPayload = (
  values: IInitValues,
  sourceEntity: OptionUnit
) => {
  let payload = {
    orderIndex: sourceEntity.orderIndex,
    value: values.value,
    isMandatory: values.isMandatory,
    serializedValues: new List<any>(
      new List(values.dirtyValues)
        .select((valueItem) => {
          return {
            value: valueItem.value,
          };
        })
        .toArray()
    )
      .concat(
        new List<any>(values.dirtyValuesToDelete)
          .select((deletedValueItem) => {
            return {
              id: deletedValueItem.getUnitValueId(),
              value: deletedValueItem.text,
              isDeleted: true,
            };
          })
          .toArray()
      )
      .toArray(),
    id: sourceEntity.id,
    imageBlob: values.imageFile,
    imageUrl: sourceEntity.imageUrl,
    price: sourceEntity.currentPrice ? sourceEntity.currentPrice.price : 0,
    currencyTypeId: sourceEntity.currentPrice
      ? sourceEntity.currentPrice.currencyTypeId
      : 0,
  };

  if (!values.isRemovingImage) {
    payload.imageBlob = null;
    payload.imageUrl = '';
  }

  payload.price = values.priceValue;
  payload.currencyTypeId = values.priceCurrencyId;

  return payload;
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

const _initDefaultValues = (
  currencies: CurrencyType[],
  sourceEntity?: OptionUnit | null
) => {
  const initValues: IInitValues = {
    value: '',
    imageUrl: '',
    isMandatory: false,
    imageFile: null,
    isRemovingImage: false,
    dirtyValues: [],
    dirtyValuesToDelete: [],
    unitToDelete: sourceEntity,
    priceValue: 0,
    priceCurrencyId: currencies.length > 0 ? currencies[0].id : 0,
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

    if (sourceEntity.currentPrice) {
      initValues.priceValue = sourceEntity.currentPrice.price;
      initValues.priceCurrencyId = sourceEntity.currentPrice.currencyTypeId;
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
      initValues.isRemovingImage !== values.isRemovingImage ||
      values.dirtyValuesToDelete.length > 0 ||
      values.dirtyValues.length > 0 ||
      initValues.priceValue !== values.priceValue ||
      initValues.priceCurrencyId !== values.priceCurrencyId;
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
  const [unitValues, setUnitValues] = useState<UnitValue[]>([]);

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

  const currencies: CurrencyType[] = useSelector<
    IApplicationState,
    CurrencyType[]
  >((state) => state.units.сurrencies);

  const optionGroup: OptionGroup | null | undefined = useSelector<
    IApplicationState,
    OptionGroup | null | undefined
  >(
    (state) => state.productSettings.managingOptionUnitsState.targetOptionGroup
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
            GetCommandBarItemProps(CommandBarItem.Reset, () => {
              setUnitValues(
                sectedOptionUnit ? [...sectedOptionUnit.unitValues] : []
              );
              formikReference.formik.resetForm();
            }),
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
            GetCommandBarItemProps(CommandBarItem.Reset, () => {
              setUnitValues(
                sectedOptionUnit ? [...sectedOptionUnit.unitValues] : []
              );
              formikReference.formik.resetForm();
            }),
            GetCommandBarItemProps(CommandBarItem.Delete, () => onDeleteUnit()),
          ])
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikReference, sectedOptionUnit]);

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

  useEffect(() => {
    setUnitValues(sectedOptionUnit ? sectedOptionUnit.unitValues : []);
  }, [sectedOptionUnit]);

  const onUpdateUnit = (values: IInitValues) => {
    if (targetProduct && values.unitToDelete) {
      const payload = _buildUpdatedUnitPayload(values, values.unitToDelete);
      console.log(payload);

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
    if (targetProduct && optionGroup) {
      const payload = _buildNewUnitPayload(values, optionGroup.id);

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
            'Delete style option',
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
        dirtyValues: Yup.array(),
        dirtyValuesToDelete: Yup.array(),
        priceValue: Yup.number().min(0, `Price can't be negative`),
        priceCurrencyId: Yup.string(),
      })}
      initialValues={_initDefaultValues(currencies, sectedOptionUnit)}
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
            <Stack grow={1}>
              <Field name="value">
                {() => (
                  <div className="form__group">
                    <TextField
                      value={formik.values.value}
                      styles={fabricStyles.textFildLabelStyles}
                      className="form__group__field"
                      label="Name"
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

              <div style={{ marginTop: '15px' }}>
                <UnitValuesInput
                  optionUnit={sectedOptionUnit}
                  unitValues={unitValues}
                  onCallback={(
                    dirtyUnitValues: UnitValueModel[],
                    dirtyValuesToDelete: UnitValueModel[]
                  ) => {
                    formik.setFieldValue('dirtyValues', dirtyUnitValues);
                    formik.setFieldTouched('dirtyValues');

                    formik.setFieldValue(
                      'dirtyValuesToDelete',
                      dirtyValuesToDelete
                    );
                    formik.setFieldTouched('dirtyValuesToDelete');
                  }}
                />
              </div>

              <Field name="priceValue">
                {() => (
                  <div className="form__group">
                    <UnitPriceInput
                      optionGroup={optionGroup}
                      editingUnit={sectedOptionUnit}
                      formik={formik}
                    />
                  </div>
                )}
              </Field>

              <div style={{ marginTop: '20px' }}>
                <AttachField formik={formik} />
              </div>
            </Stack>
          </Form>
        ) : (
          _renderHintLable('Select and explore or define new style option.')
        );
      }}
    </Formik>
  );
};

export default ManagingProductUnitForm;
