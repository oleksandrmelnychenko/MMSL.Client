import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Stack } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../redux/reducers';
import {
  CustomerProductProfile,
  IUpdateOrderProfilePayload,
} from '../../../../interfaces/orderProfile';
import { ProductCategory } from '../../../../interfaces/products';
import StyleSelectorInput from './styleSelector/StyleSelectorInput';
import { IStyleUnitModel, initUnitItems } from './styleSelector/StyleUnitItem';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { orderProfileActions } from '../../../../redux/slices/orderProfile/orderProfile.slice';

export interface IOrderStylesFormProps {
  productCategory: ProductCategory;
}

export const STYLE_UNITS_VALUES_FORM_FIELD = 'productStyleValues';

interface IFormValues {
  productStyleValues: IStyleUnitModel[];
  productStyleValuesDefaultsHelper: IStyleUnitModel[];
}

const _initDefaultValues = (
  productCategory: ProductCategory | null | undefined,
  sourceEntity?: CustomerProductProfile | null | undefined
) => {
  const initValues: IFormValues = {
    productStyleValues: [],
    productStyleValuesDefaultsHelper: [],
  };

  if (sourceEntity) {
  }

  initValues.productStyleValues = initUnitItems(
    productCategory,
    sourceEntity
  ) as [];

  initValues.productStyleValuesDefaultsHelper = initUnitItems(
    productCategory,
    sourceEntity
  ) as [];

  return initValues;
};

const _buildEditedPayload = (
  values: IFormValues,
  sourceEntity: CustomerProductProfile
) => {
  let payload: IUpdateOrderProfilePayload = {
    fittingTypeId: sourceEntity.fittingTypeId ? sourceEntity.fittingTypeId : 0,
    measurementSizeId: sourceEntity.measurementSizeId
      ? sourceEntity.measurementSizeId
      : 0,
    measurementId: sourceEntity.measurementId ? sourceEntity.measurementId : 0,
    profileType: sourceEntity.profileType,
    name: sourceEntity.name,
    description: sourceEntity.description,
    id: sourceEntity.id,
    storeCustomerId: sourceEntity.storeCustomerId,
    values: [],
    productStyles: new List(values.productStyleValues)
      .where((unitModel: IStyleUnitModel) => unitModel.isDirty)
      .select((unitModel: IStyleUnitModel) => {
        return {
          id: unitModel.id,
          isDeleted: unitModel.isDeleted,
          selectedStyleValueId: unitModel.selectedStyleValueId,
          optionUnitId: unitModel.optionUnitId,
        };
      })
      .toArray(),
  };

  return payload;
};

export const OrderStylesForm: React.FC<IOrderStylesFormProps> = (
  props: IOrderStylesFormProps
) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const targetOrderProfile:
    | CustomerProductProfile
    | null
    | undefined = useSelector<
    IApplicationState,
    CustomerProductProfile | null | undefined
  >((state) => state.orderProfile.targetOrderProfile);

  const [formInit, setFormInit] = useState<any>(
    _initDefaultValues(props.productCategory, targetOrderProfile)
  );

  useEffect(() => {
    setFormInit(_initDefaultValues(props.productCategory, targetOrderProfile));
  }, [targetOrderProfile, props.productCategory]);

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();

            setFormInit(
              _initDefaultValues(props.productCategory, targetOrderProfile)
            );
          }),
        ])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onEdit = (values: IFormValues) => {
    if (targetOrderProfile) {
      const payload = _buildEditedPayload(values, targetOrderProfile);

      dispatch(
        assignPendingActions(
          orderProfileActions.apiUpdateOrderProfile(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              assignPendingActions(
                orderProfileActions.apiGetOrderProfiles(),
                [],
                [],
                (args: any) => {
                  dispatch(orderProfileActions.changeOrderProfiles(args));
                  dispatch(controlActions.closeRightPanel());
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
        productStyleValues: Yup.array(),
        productStyleValuesDefaultsHelper: Yup.array(),
      })}
      initialValues={formInit}
      onSubmit={(values: any) => {
        if (targetOrderProfile) onEdit(values);
      }}
      onReset={(values: any, formikHelpers: any) => {}}
      innerRef={(formik: any) => {
        formikReference.formik = formik;
        if (formik) {
          setFormikDirty(
            formik.dirty ||
              new List<IStyleUnitModel>(formik.values.productStyleValues).any(
                (item: IStyleUnitModel) => item.isDirty
              )
          );
        }
      }}
      validateOnBlur={false}
      enableReinitialize={true}
    >
      {(formik) => {
        return (
          <Form className="form">
            <div className="dealerFormManage">
              <Stack>
                <StyleSelectorInput formik={formik} />
              </Stack>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderStylesForm;
