import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Measurement } from '../../../../../interfaces/measurements';
import {
  ProfileTypes,
  ICreateOrderProfilePayload,
  IMeasurementValuePayload,
} from '../../../../../interfaces/orderProfile';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ProductCategory } from '../../../../../interfaces/products';
import {
  IInputValueModel,
  initInputValueModelDefaults,
} from '../orderMeasurements/valueMeasurementInputs/ValueItem';
import {
  IStyleUnitModel,
  initUnitItems,
} from '../orderStyles/styleSelector/StyleUnitItem';
import { List } from 'linq-typescript';
import { StoreCustomer } from '../../../../../interfaces/storeCustomer';
import { profileManagingActions } from '../../../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { FormicReference } from '../../../../../interfaces';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { orderProfileActions } from '../../../../../redux/slices/customer/orderProfile/orderProfile.slice';
import { useHistory } from 'react-router-dom';
import { onBackFromProfileManaging } from '../../../options/ManageProfileOptiosPanel';
import ProfileFormMarkup from './ProfileFormMarkup';
import { IApplicationState } from '../../../../../redux/reducers';

export interface IProfileFormProps {
  measurements: Measurement[];
  product: ProductCategory;
  customer: StoreCustomer;
}

interface IFormValues {
  name: string;
  description: string;
  /// Measurement scope
  profileType: ProfileTypes;
  measurementId: number;
  fittingTypeId: number;
  freshMeasuremrntValues: IInputValueModel[];
  measurementSizeId: number;
  baseMeasuremrntValues: IInputValueModel[];
  bodyMeasuremrntValues: IInputValueModel[];
  valuesDefaultsHelper: IInputValueModel[];
  /// Styles scope
  productStyleValues: IStyleUnitModel[];
  productStyleValuesDefaultsHelper: IStyleUnitModel[];
}

const _urgentItemsDirtyHelper = (formik: any) => {
  let isDirtyResult = false;

  if (formik.values.profileType === ProfileTypes.FreshMeasurement) {
    isDirtyResult = new List(formik.values.freshMeasuremrntValues).any(
      (item: any) => item.value !== item.initValue
    );
  } else if (formik.values.profileType === ProfileTypes.BaseMeasurement) {
    isDirtyResult = new List(formik.values.baseMeasuremrntValues).any(
      (item: any) => item.value !== item.initValue
    );
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    isDirtyResult = new List(formik.values.bodyMeasuremrntValues).any(
      (item: any) =>
        item.value !== item.initValue ||
        item.fittingValue !== item.initFittingValue
    );
  }

  return isDirtyResult;
};

const _initDefaultMeasurementValues = (
  initValues: IFormValues,
  measurements: Measurement[]
) => {
  if (initValues.profileType === 0)
    initValues.profileType =
      measurements.length === 0
        ? ProfileTypes.Reference
        : ProfileTypes.FreshMeasurement;

  if (initValues.measurementId === 0)
    initValues.measurementId = measurements.length > 0 ? measurements[0].id : 0;

  const targetMeasurement: Measurement | null | undefined = new List(
    measurements
  ).firstOrDefault(
    (measurement) => measurement.id === initValues.measurementId
  );

  initValues.freshMeasuremrntValues = initInputValueModelDefaults(
    targetMeasurement,
    null
  ) as [];

  initValues.baseMeasuremrntValues = initInputValueModelDefaults(
    targetMeasurement,
    null
  ) as [];

  initValues.bodyMeasuremrntValues = initInputValueModelDefaults(
    targetMeasurement,
    null
  ) as [];

  initValues.valuesDefaultsHelper = initInputValueModelDefaults(
    targetMeasurement,
    null
  ) as [];
};

const _initDefaultStyleValues = (
  initValues: IFormValues,
  productCategory: ProductCategory
) => {
  initValues.productStyleValues = initUnitItems(productCategory, null) as [];

  initValues.productStyleValuesDefaultsHelper = initUnitItems(
    productCategory,
    null
  ) as [];
};

const _initDefaultValues = (
  measurements: Measurement[],
  productCategory: ProductCategory
) => {
  const initValues: IFormValues = {
    name: '',
    description: '',
    /// Measurement scope
    profileType: ProfileTypes.FreshMeasurement,
    measurementId: 0,
    fittingTypeId: 0,
    measurementSizeId: 0,
    freshMeasuremrntValues: [],
    baseMeasuremrntValues: [],
    bodyMeasuremrntValues: [],
    valuesDefaultsHelper: [],
    /// Styles scope
    productStyleValues: [],
    productStyleValuesDefaultsHelper: [],
  };

  _initDefaultMeasurementValues(initValues, measurements);
  _initDefaultStyleValues(initValues, productCategory);

  return initValues;
};

const _buildMeasurementPayloadValues = (valueModels: IInputValueModel[]) => {
  return new List(valueModels)
    .select((valueItem) => {
      const result: IMeasurementValuePayload = {
        value: valueItem.value,
        fittingValue: valueItem.fittingValue,
        measurementDefinitionId: valueItem.measurementDefinitionId,
        id: valueItem.id,
      };
      return result;
    })
    .toArray();
};

const _buildNewPayload = (
  values: IFormValues,
  productCategory: ProductCategory,
  customer: StoreCustomer
) => {
  let payload: ICreateOrderProfilePayload = {
    fittingTypeId: values.fittingTypeId,
    measurementSizeId: values.measurementSizeId,
    measurementId: values.measurementId,
    profileType: values.profileType,
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
    name: values.name,
    description: values.description,
    id: 0,
    storeCustomerId: customer.id,
    productCategoryId: productCategory.id,
  };

  if (payload.profileType === ProfileTypes.FreshMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.freshMeasuremrntValues
    );
    payload.fittingTypeId = 0;
    payload.measurementSizeId = 0;
  } else if (payload.profileType === ProfileTypes.BaseMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.baseMeasuremrntValues
    );
    payload.fittingTypeId = 0;
  } else if (payload.profileType === ProfileTypes.BodyMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.bodyMeasuremrntValues
    );
    payload.measurementSizeId = 0;
  } else if (payload.profileType === ProfileTypes.Reference) {
    payload.fittingTypeId = 0;
    payload.measurementSizeId = 0;
    payload.measurementId = 0;
  }

  return payload;
};

export const ProfileForm: React.FC<IProfileFormProps> = (
  props: IProfileFormProps
) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [formInit, setFormInit] = useState<any>(
    _initDefaultValues(props.measurements, props.product)
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  const customerProductProfiles: ProductCategory[] = useSelector<
    IApplicationState,
    ProductCategory[]
  >((state) => state.orderProfile.customerProductProfiles);

  useEffect(() => {
    dispatch(
      profileManagingActions.updateCommands([
        {
          className: 'management__btn-back_measurement',
          isDisabled: !isFormikDirty,
          name: 'Save',
          onClick: () => {
            if (formikReference.formik) {
              formikReference.formik.submitForm();
            }
          },
        },
        {
          className: 'management__btn-back_measurement',
          isDisabled: !isFormikDirty,
          name: 'Reset',
          onClick: () => {
            if (formikReference.formik) {
              formikReference.formik.resetForm();
              setFormInit(
                _initDefaultValues(props.measurements, props.product)
              );
            }
          },
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty, dispatch]);

  useEffect(() => {
    setFormInit(_initDefaultValues(props.measurements, props.product));
  }, [props.measurements, props.product]);

  const onCreate = (values: IFormValues) => {
    const payload = _buildNewPayload(values, props.product, props.customer);
    console.log(payload);

    dispatch(
      assignPendingActions(
        orderProfileActions.apiCreateOrderProfile(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            assignPendingActions(
              orderProfileActions.apiGetProductProfilesByCutomerId(
                props.customer.id
              ),
              [],
              [],
              (args: any) => {
                dispatch(
                  orderProfileActions.changeCustomerProductProfiles(args)
                );
                onBackFromProfileManaging(dispatch, history);
              },
              (args: any) => {}
            )
          );
        },
        (args: any) => {}
      )
    );
  };

  return (
    <div className="profileForm">
      {
        <Formik
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(3)
              .required(() => 'Name is required'),
            description: Yup.string(),
            profileType: Yup.number(),
            measurementId: Yup.number(),
            fittingTypeId: Yup.number(),
            measurementSizeId: Yup.number(),
            freshMeasuremrntValues: Yup.array(),
            baseMeasuremrntValues: Yup.array(),
            bodyMeasuremrntValues: Yup.array(),
            productStyleValues: Yup.array(),
            productStyleValuesDefaultsHelper: Yup.array(),
          })}
          initialValues={formInit}
          onSubmit={(values: any) => {
            // if (targetOrderProfile) onEdit(values);
            // else onCreate(values);
            onCreate(values);
          }}
          onReset={(values: any, formikHelpers: any) => {}}
          innerRef={(formik: any) => {
            // formikReference.formik = formik;
            // if (formik) setFormikDirty(formik.dirty);

            formikReference.formik = formik;

            if (formik) {
              setFormikDirty(
                formik.dirty ||
                  _urgentItemsDirtyHelper(formik) ||
                  new List<IStyleUnitModel>(
                    formik.values.productStyleValues
                  ).any((item: IStyleUnitModel) => item.isDirty)
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
                  <ProfileFormMarkup
                    measurements={props.measurements}
                    product={props.product}
                    customer={props.customer}
                    formik={formik}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      }
    </div>
  );
};

export default ProfileForm;
