import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import {
  ProductPermissionSettings,
  ProductCategory,
} from '../../../../interfaces/products';
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
import { StoreCustomer } from '../../../../interfaces/storeCustomer';
import CustomersInput from './CustomersInput';
import ProductsInput from './ProductsInput';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { orderProfileActions } from '../../../../redux/slices/orderProfile/orderProfile.slice';

export interface IOrderProfileFormProps {
  customers: StoreCustomer[];
  productCategories: ProductCategory[];
}

interface IFormValues {
  name: string;
  description: string;
  customer: StoreCustomer | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const _initDefaultValues = (
  sourceEntity?: ProductPermissionSettings | null
) => {
  const initValues: IFormValues = {
    name: '',
    description: '',
    customer: null,
    productCategory: null,
  };

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

const _buildNewPayload = (values: IFormValues) => {
  let payload: any = {
    name: values.name,
    description: values.description,
    productCategoryId: values.productCategory ? values.productCategory.id : 0,
    storeCustomerId: values.customer ? values.customer.id : 0,
  };

  return payload;
};

const _buildEditedPayload = (
  values: IFormValues,
  sourceEntity: any | null | undefined
) => {
  let payload: any = {};

  return payload;
};

export const OrderProfileForm: React.FC<IOrderProfileFormProps> = (
  props: IOrderProfileFormProps
) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const orderProfiles: any[] = useSelector<IApplicationState, any[]>(
    (state) => state.orderProfile.orderProfiles
  );

  const targetOrderProfile: any | null | undefined = useSelector<
    IApplicationState,
    any | null | undefined
  >((state) => state.orderProfile.targetOrderProfile);

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

  const onEdit = (values: IFormValues) => {
    const payload = _buildEditedPayload(values, targetOrderProfile);
    console.log(payload);
  };

  const onCreate = (values: IFormValues) => {
    const payload = _buildNewPayload(values);

    dispatch(
      assignPendingActions(
        orderProfileActions.apiCreateOrderProfile(payload),
        [],
        [],
        (args: any) => {
          debugger;
          dispatch(
            orderProfileActions.changeOrderProfiles(
              new List(orderProfiles).concat([args.body]).toArray()
            )
          );

          dispatch(controlActions.closeRightPanel());
        },
        (args: any) => {}
      )
    );
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(3)
          .required(() => 'Name is required'),
        description: Yup.string(),
        customer: Yup.object().nullable().required('Customer is required'),
        productCategory: Yup.object()
          .nullable()
          .required('Product is required'),
      })}
      initialValues={_initDefaultValues(targetOrderProfile)}
      onSubmit={(values: any) => {
        if (targetOrderProfile) onEdit(values);
        else onCreate(values);
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
                <CustomersInput customers={props.customers} formik={formik} />
                <ProductsInput
                  products={props.productCategories}
                  formik={formik}
                />
              </Stack>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderProfileForm;
