import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, Checkbox } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import '../../../dealers/managing/dealerManaging/manageDealerForm.scss';
import { FormicReference } from '../../../../interfaces';
import { OptionGroup } from '../../../../interfaces/options';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../redux/slices/control.slice';
import { rightPanelActions } from '../../../../redux/slices/rightPanel.slice';
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
import GroupPriceInput from './price/GroupPriceInput';
import { CurrencyType } from '../../../../interfaces/currencyTypes';
import Entry from '../../../../common/formFields/Entry';
import FormCheckbox from '../../../../common/formFields/FormCheckbox';

interface IInitValues {
  name: string;
  isMandatory: boolean;
  priceValue: number;
  priceCurrencyId: number;
  declareSharedStylePrice: boolean;
  isBodyPosture: boolean;
}

const _buildNewPayload = (values: IInitValues, product: ProductCategory) => {
  let payload: any = {
    productId: product.id,
    name: values.name,
    isMandatory: values.isMandatory,
    isBodyPosture: values.isBodyPosture,
  };

  if (values.declareSharedStylePrice) {
    payload.price = `${values.priceValue}`;
    payload.currencyTypeId = values.priceCurrencyId;
  } else {
    payload.price = null;
    payload.currencyTypeId = null;
  }

  return payload;
};

const _buildUpdatedPayload = (
  values: IInitValues,
  sourceEntity: OptionGroup
) => {
  let payload: any = {
    id: sourceEntity.id,
    isDeleted: sourceEntity.isDeleted,
    isBodyPosture: values.isBodyPosture,
  };

  payload.name = values.name;
  payload.isMandatory = values.isMandatory;

  if (values.declareSharedStylePrice) {
    payload.price = `${values.priceValue}`;
    payload.currencyTypeId = 0;
    payload.currencyTypeId = parseInt(`${values.priceCurrencyId}`);
  } else {
    payload.price = null;
    payload.currencyTypeId = null;
  }

  return payload;
};

const _initDefaultValues = (
  currencies: CurrencyType[],
  sourceEntity?: OptionGroup | null
) => {
  const initValues: IInitValues = {
    name: '',
    isMandatory: false,
    priceValue: 0,
    priceCurrencyId: currencies.length > 0 ? currencies[0].id : 0,
    declareSharedStylePrice: false,
    isBodyPosture: false,
  };

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.isMandatory = sourceEntity.isMandatory;
    initValues.isBodyPosture = sourceEntity.isBodyPosture;

    if (sourceEntity.currentPrice) {
      initValues.declareSharedStylePrice = true;
      initValues.priceValue = sourceEntity.currentPrice.price;
      initValues.priceCurrencyId = sourceEntity.currentPrice.currencyTypeId;
    }
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
    (state) => state.rightPanel.rightPanel.commandBarItems
  );

  const targetProduct: ProductCategory | null | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.product.choose.category);

  const editingGroup: OptionGroup | null | undefined = useSelector<
    IApplicationState,
    OptionGroup | null | undefined
  >((state) => state.productSettings.editingOptionGroup);

  const currencies: CurrencyType[] = useSelector<
    IApplicationState,
    CurrencyType[]
  >((state) => state.units.сurrencies);

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
        rightPanelActions.setPanelButtons([
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
        rightPanelActions.setPanelButtons(
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
                  dispatch(rightPanelActions.closeRightPanel());
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
                  dispatch(rightPanelActions.closeRightPanel());
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
    <Formik
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(3)
          .required(() => 'Name is required'),
        priceValue: Yup.number().min(0, `Price can't be negative`),
        isBodyPosture: Yup.boolean(),
        priceCurrencyId: Yup.string(),
        isMandatory: Yup.boolean(),
        declareSharedStylePrice: Yup.boolean(),
      })}
      initialValues={_initDefaultValues(currencies, editingGroup)}
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
              <Stack>
                <Entry
                  formik={formik}
                  label={'Name'}
                  fieldName={'name'}
                  isRequired
                />

                <FormCheckbox
                  formik={formik}
                  label={'Is mandatory'}
                  fieldName={'isMandatory'}
                />

                <FormCheckbox
                  formik={formik}
                  label={'Is body posture'}
                  fieldName={'isBodyPosture'}
                />

                <Field name="declareSharedStylePrice">
                  {() => {
                    return (
                      <div
                        className="form__group"
                        style={{ marginTop: '20px' }}
                      >
                        <Checkbox
                          checked={formik.values.declareSharedStylePrice}
                          label="Declare single style price"
                          onChange={(checked: any, isChecked: any) => {
                            formik.setFieldValue(
                              'declareSharedStylePrice',
                              isChecked
                            );
                            formik.setFieldTouched('declareSharedStylePrice');

                            formik.setFieldValue(
                              'priceValue',
                              formik.initialValues.priceValue
                            );
                            formik.setFieldTouched('priceValue');

                            formik.setFieldValue(
                              'priceCurrencyId',
                              formik.initialValues.priceCurrencyId
                            );
                            formik.setFieldTouched('priceCurrencyId');
                          }}
                        />
                      </div>
                    );
                  }}
                </Field>

                <Field name="priceValue">
                  {() => (
                    <div className="form__group">
                      <GroupPriceInput
                        isEnabled={formik.values.declareSharedStylePrice}
                        editingGroup={editingGroup}
                        formik={formik}
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
  );
};

export default ManagingvOptionGroupForm;
