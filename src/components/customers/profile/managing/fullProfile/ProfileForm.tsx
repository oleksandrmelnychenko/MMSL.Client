import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Measurement } from '../../../../../interfaces/measurements';
import {
  ProfileTypes,
  ICreateOrderProfilePayload,
  IMeasurementValuePayload,
  CustomerProductProfile,
} from '../../../../../interfaces/orderProfile';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ProductCategory } from '../../../../../interfaces/products';
import {
  IInputValueModel,
  initInputValueModelDefaults,
} from './inputs/productMeasurement/ValueItem';
import {
  IStyleUnitModel,
  initUnitItems,
} from './inputs/productStyle/StyleUnitItem';
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

export const PROFILE_TYPE_FORM_FIELD = 'profileType';
export const MEASUREMENT_ID_FORM_FIELD = 'measurementId';
export const FITTING_TYPE_ID_FORM_FIELD = 'fittingTypeId';
export const MEASUREMENT_SIZE_ID_FORM_FIELD = 'measurementSizeId';
export const MEASUREMENT_VALUES_FORM_FIELD = 'measurementValues';
export const STYLE_UNITS_VALUES_FORM_FIELD = 'productStyleValues';

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
  measurementSizeId: number;
  measurementValues: IInputValueModel[];
  valuesDefaultsHelper: IInputValueModel[];
  /// Styles scope
  productStyleValues: IStyleUnitModel[];
  productStyleValuesDefaultsHelper: IStyleUnitModel[];
}

const _urgentItemsDirtyHelper = (formik: any) => {
  let isDirtyResult = false;

  if (
    formik.values.profileType === ProfileTypes.FreshMeasurement ||
    formik.values.profileType === ProfileTypes.BaseMeasurement
  ) {
    isDirtyResult = new List(formik.values.measurementValues).any(
      (item: any) => item.value !== item.initValue
    );
  } else if (formik.values.profileType === ProfileTypes.BodyMeasurement) {
    isDirtyResult = new List(formik.values.measurementValues).any(
      (item: any) =>
        item.value !== item.initValue ||
        item.fittingValue !== item.initFittingValue
    );
  }

  return isDirtyResult;
};

const _initDefaultMeasurementValues = (
  initValues: IFormValues,
  measurements: Measurement[],
  sourceEntity: CustomerProductProfile | null | undefined
) => {
  if (sourceEntity) {
    initValues.profileType = sourceEntity.profileType;
    initValues.measurementId = sourceEntity.measurementId
      ? sourceEntity.measurementId
      : 0;
    initValues.fittingTypeId = sourceEntity.fittingTypeId
      ? sourceEntity.fittingTypeId
      : 0;
    initValues.measurementSizeId = sourceEntity.measurementSizeId
      ? sourceEntity.measurementSizeId
      : 0;
  }

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

  initValues.measurementValues = initInputValueModelDefaults(
    targetMeasurement,
    sourceEntity
  ) as [];

  initValues.valuesDefaultsHelper = initInputValueModelDefaults(
    targetMeasurement,
    sourceEntity
  ) as [];
};

const _initDefaultStyleValues = (
  initValues: IFormValues,
  productCategory: ProductCategory,
  sourceEntity: CustomerProductProfile | null | undefined
) => {
  initValues.productStyleValues = initUnitItems(
    productCategory,
    sourceEntity
  ) as [];

  initValues.productStyleValuesDefaultsHelper = initUnitItems(
    productCategory,
    sourceEntity
  ) as [];
};

const _initDefaultValues = (
  measurements: Measurement[],
  productCategory: ProductCategory,
  sourceEntity: CustomerProductProfile | null | undefined
) => {
  const initValues: IFormValues = {
    name: '',
    description: '',
    /// Measurement scope
    profileType: ProfileTypes.FreshMeasurement,
    measurementId: 0,
    fittingTypeId: 0,
    measurementSizeId: 0,
    measurementValues: [],
    valuesDefaultsHelper: [],
    /// Styles scope
    productStyleValues: [],
    productStyleValuesDefaultsHelper: [],
  };

  _initDefaultMeasurementValues(initValues, measurements, sourceEntity);
  _initDefaultStyleValues(initValues, productCategory, sourceEntity);

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

const _buildMeasurementPayloadValues = (
  valueModels: IInputValueModel[],
  profileType: ProfileTypes
) => {
  return new List(valueModels)
    .select((valueItem) => {
      const result: IMeasurementValuePayload = {
        value: valueItem.value,
        fittingValue:
          profileType === ProfileTypes.BodyMeasurement
            ? valueItem.fittingValue
            : '',
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
      values.measurementValues,
      payload.profileType
    );
    payload.fittingTypeId = 0;
    payload.measurementSizeId = 0;
  } else if (payload.profileType === ProfileTypes.BaseMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.measurementValues,
      payload.profileType
    );
    payload.fittingTypeId = 0;
  } else if (payload.profileType === ProfileTypes.BodyMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.measurementValues,
      payload.profileType
    );
    payload.measurementSizeId = 0;
  } else if (payload.profileType === ProfileTypes.Reference) {
    payload.fittingTypeId = 0;
    payload.measurementSizeId = 0;
    payload.measurementId = 0;
  }

  return payload;
};

const _buildEditedPayload = (
  values: IFormValues,
  productCategory: ProductCategory,
  customer: StoreCustomer,
  sourceEntity: CustomerProductProfile
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
    id: sourceEntity.id,
    storeCustomerId: customer.id,
    productCategoryId: productCategory.id,
  };

  if (payload.profileType === ProfileTypes.FreshMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.measurementValues,
      payload.profileType
    );
    payload.fittingTypeId = 0;
    payload.measurementSizeId = 0;
  } else if (payload.profileType === ProfileTypes.BaseMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.measurementValues,
      payload.profileType
    );
    payload.fittingTypeId = 0;
  } else if (payload.profileType === ProfileTypes.BodyMeasurement) {
    payload.values = _buildMeasurementPayloadValues(
      values.measurementValues,
      payload.profileType
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

  const profileForEdit: CustomerProductProfile | null | undefined = useSelector<
    IApplicationState,
    CustomerProductProfile | null | undefined
  >((state) => state.profileManaging.profileForEdit);

  const productId: number = useSelector<IApplicationState, number>(
    (state) => state.profileManaging.productId
  );

  const [formInit, setFormInit] = useState<any>(
    _initDefaultValues(props.measurements, props.product, profileForEdit)
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  useEffect(() => {
    dispatch(
      profileManagingActions.updateCommands([
        {
          className: 'management__btn-save',
          isDisabled: !isFormikDirty,
          name: 'Save',
          onClick: () => {
            if (formikReference.formik) {
              formikReference.formik.submitForm();
            }
          },
        },
        {
          className: 'management__btn-reset',
          isDisabled: !isFormikDirty,
          name: 'Reset',
          onClick: () => {
            if (formikReference.formik) {
              formikReference.formik.resetForm();
              setFormInit(
                _initDefaultValues(
                  props.measurements,
                  props.product,
                  profileForEdit
                )
              );
            }
          },
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty, dispatch]);

  useEffect(() => {
    setFormInit(
      _initDefaultValues(props.measurements, props.product, profileForEdit)
    );
  }, [props.measurements, props.product, props.customer, profileForEdit]);

  const onCreate = (values: IFormValues) => {
    const payload = _buildNewPayload(values, props.product, props.customer);

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

                dispatch(
                  orderProfileActions.changeSelectedProductProfiles(
                    new List<ProductCategory>(args).firstOrDefault(
                      (product) => product.id === productId
                    )
                  )
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

  const onEdit = (
    values: IFormValues,
    profileForEdit: CustomerProductProfile
  ) => {
    const payload = _buildEditedPayload(
      values,
      props.product,
      props.customer,
      profileForEdit
    );

    dispatch(
      assignPendingActions(
        orderProfileActions.apiUpdateOrderProfile(payload),
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

                dispatch(
                  orderProfileActions.changeSelectedProductProfiles(
                    new List<ProductCategory>(args).firstOrDefault(
                      (product) => product.id === productId
                    )
                  )
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
            measurementId: Yup.number().test(
              'measurementId',
              'Measurement is required',
              (args: any) => {
                let result = true;

                if (formikReference?.formik?.values) {
                  if (formikReference.formik.values.measurementId <= 0) {
                    result = false;
                  }
                }

                return result;
              }
            ),
            fittingTypeId: Yup.number().test(
              'fittingTypeId',
              'Body fitting is required for body measurement',
              (args: any) => {
                let result = true;

                if (formikReference?.formik?.values) {
                  if (
                    formikReference.formik.values.profileType ===
                      ProfileTypes.BodyMeasurement &&
                    formikReference.formik.values.fittingTypeId <= 0
                  ) {
                    result = false;
                  }
                }

                return result;
              }
            ),
            measurementSizeId: Yup.number().test(
              'measurementSizeId',
              'Size is required for base measurement',
              (args: any) => {
                let result = true;

                if (formikReference?.formik?.values) {
                  if (
                    formikReference.formik.values.profileType ===
                      ProfileTypes.BaseMeasurement &&
                    formikReference.formik.values.measurementSizeId <= 0
                  ) {
                    result = false;
                  }
                }

                return result;
              }
            ),
            measurementValues: Yup.array().test(
              'measurementValues',
              'All measurement columns need values',
              (args: any) => {
                let result = true;

                if (formikReference?.formik?.values) {
                  const profileType = formikReference.formik.values.profileType;

                  if (
                    profileType === ProfileTypes.FreshMeasurement ||
                    profileType === ProfileTypes.BaseMeasurement
                  ) {
                    result = new List<IInputValueModel>(
                      formikReference.formik.values.measurementValues
                    ).all(
                      (valueModel: IInputValueModel) =>
                        valueModel.value !== null &&
                        valueModel.value !== undefined &&
                        valueModel.value.length > 0
                    );
                  } else if (profileType === ProfileTypes.BodyMeasurement) {
                    result = new List<IInputValueModel>(
                      formikReference.formik.values.measurementValues
                    ).all(
                      (valueModel: IInputValueModel) =>
                        valueModel.value !== null &&
                        valueModel.value !== undefined &&
                        valueModel.value.length > 0 &&
                        valueModel.fittingValue !== null &&
                        valueModel.fittingValue !== undefined &&
                        valueModel.fittingValue.length > 0
                    );
                  }
                }

                return result;
              }
            ),
            productStyleValues: Yup.array(),
            productStyleValuesDefaultsHelper: Yup.array(),
          })}
          initialValues={formInit}
          onSubmit={(values: any) => {
            if (profileForEdit) onEdit(values, profileForEdit);
            else onCreate(values);
          }}
          onReset={(values: any, formikHelpers: any) => {}}
          innerRef={(formik: any) => {
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
                    profileForEdit={profileForEdit}
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
