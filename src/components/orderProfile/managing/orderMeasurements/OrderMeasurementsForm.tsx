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
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { Measurement } from '../../../../interfaces/measurements';
import MeasurementInput from './MeasurementInput';
import BaseMeasurementInput from './valueMeasurementInputs/BaseMeasurementInput';
import FreshMeasurementInput from './valueMeasurementInputs/FreshMeasurementInput';
import BodyMeasurementInput from './valueMeasurementInputs/BodyMeasurementInput';
import ProfileTypeInput, {
  ProfileTypes,
  resolveProfileTypeInitValue,
} from './ProfileTypeInput';
import {
  IInputValueModel,
  initInputValueModelDefaults,
} from './valueMeasurementInputs/ValueItem';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { orderProfileActions } from '../../../../redux/slices/orderProfile/orderProfile.slice';

export interface IOrderMeasurementsFormProps {
  measurements: Measurement[];
}

export const PROFILE_TYPE_FORM_FIELD = 'profileType';
export const MEASUREMENT_ID_FORM_FIELD = 'measurementId';
export const FITTING_TYPE_ID_FORM_FIELD = 'fittingTypeId';
export const FRESH_MEASUREMRNT_VALUES_FORM_FIELD = 'freshMeasuremrntValues';
export const MEASUREMENT_SIZE_ID_FORM_FIELD = 'measurementSizeId';
export const BASE_MEASUREMRNT_VALUES_FORM_FIELD = 'baseMeasuremrntValues';
export const BODY_MEASUREMRNT_VALUES_FORM_FIELD = 'bodyMeasuremrntValues';

interface IUpdateOrderProfilePayload {
  measurementId: number;
  fittingTypeId: number;
  measurementSizeId: number;
  profileType: number;
  values: IMeasurementValuePayload[];
  productStyles: IProductStyleValuePayload[];
  name: string;
  description: string;
  id: number;
}

interface IMeasurementValuePayload {
  value: string;
  fittingValue: string;
  measurementDefinitionId: number;
  id: number;
}

interface IProductStyleValuePayload {
  id: number;
  isDeleted: boolean;
  selectedStyleValue: string;
  optionUnitId: number;
}

interface IFormValues {
  profileType: ProfileTypes;
  measurementId: number;
  fittingTypeId: number;
  freshMeasuremrntValues: IInputValueModel[];
  measurementSizeId: number;
  baseMeasuremrntValues: IInputValueModel[];
  bodyMeasuremrntValues: IInputValueModel[];
}

const _initDefaultValues = (
  measurements: Measurement[],
  sourceEntity?: CustomerProductProfile | null | undefined
) => {
  const initValues: IFormValues = {
    profileType: resolveProfileTypeInitValue(measurements, sourceEntity),
    measurementId: measurements.length > 0 ? measurements[0].id : 0,
    fittingTypeId: 0,
    freshMeasuremrntValues: [],
    measurementSizeId: 0,
    baseMeasuremrntValues: [],
    bodyMeasuremrntValues: [],
  };

  const targetMeasurement: Measurement | null | undefined = new List(
    measurements
  ).firstOrDefault(
    (measurement) => measurement.id === initValues.measurementId
  );

  initValues.freshMeasuremrntValues = initInputValueModelDefaults(
    targetMeasurement,
    sourceEntity
  ) as [];

  initValues.baseMeasuremrntValues = initInputValueModelDefaults(
    targetMeasurement,
    sourceEntity
  ) as [];

  initValues.bodyMeasuremrntValues = initInputValueModelDefaults(
    targetMeasurement,
    sourceEntity
  ) as [];

  if (sourceEntity) {
    /// TODO: probably use input helpers
  }

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

const _buildEditedPayload = (
  values: IFormValues,
  sourceEntity: CustomerProductProfile
) => {
  let payload: IUpdateOrderProfilePayload = {
    fittingTypeId: values.fittingTypeId,
    measurementSizeId: values.measurementSizeId,
    measurementId: values.measurementId,
    profileType: values.profileType,
    values: [],
    productStyles: [],
    name: sourceEntity.name,
    description: sourceEntity.description,
    id: sourceEntity.id,
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

export const OrderMeasurementsForm: React.FC<IOrderMeasurementsFormProps> = (
  props: IOrderMeasurementsFormProps
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
    if (targetOrderProfile) {
      const payload = _buildEditedPayload(values, targetOrderProfile);

      console.log(payload);
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
        profileType: Yup.number().required(() => 'Profile type is required'),
        measurementId: Yup.number(),
        fittingTypeId: Yup.number(),
      })}
      initialValues={_initDefaultValues(props.measurements, targetOrderProfile)}
      onSubmit={(values: any) => {
        if (targetOrderProfile) onEdit(values);
      }}
      onReset={(values: any, formikHelpers: any) => {}}
      innerRef={(formik: any) => {
        formikReference.formik = formik;
        if (formik) {
          setFormikDirty(formik.dirty);
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
                <ProfileTypeInput
                  formik={formik}
                  availableMeasurements={props.measurements}
                  orderProfile={targetOrderProfile}
                />

                <MeasurementInput
                  measurements={props.measurements}
                  formik={formik}
                  orderProfile={targetOrderProfile}
                />

                <FreshMeasurementInput
                  formik={formik}
                  orderProfile={targetOrderProfile}
                />

                <BaseMeasurementInput
                  formik={formik}
                  orderProfile={targetOrderProfile}
                />

                <BodyMeasurementInput
                  formik={formik}
                  orderProfile={targetOrderProfile}
                />
              </Stack>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderMeasurementsForm;
