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
import FittingTypeInput from './FittingTypeInput';
import FreshMeasurementInput, {
  initInputValueModelDefaults,
} from './valueMeasurementInputs/FreshMeasurementInput';
import ProfileTypeInput, {
  ProfileTypes,
  resolveProfileTypeInitValue,
} from './ProfileTypeInput';

export interface IOrderMeasurementsFormProps {
  measurements: Measurement[];
}

export const PROFILE_TYPE_FORM_FIELD = 'profileType';
export const MEASUREMENT_ID_FORM_FIELD = 'measurementId';
export const FITTING_TYPE_ID_FORM_FIELD = 'fittingTypeId';
export const FRESH_MEASUREMRNT_VALUES_FORM_FIELD = 'freshMeasuremrntValues';
export const MEASUREMENT_SIZE_ID_FORM_FIELD = 'measurementSizeId';

interface IFormValues {
  profileType: ProfileTypes;
  measurementId: number;
  fittingTypeId: number;
  freshMeasuremrntValues: [];
  measurementSizeId: number;
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
  };

  initValues.freshMeasuremrntValues = initInputValueModelDefaults(
    new List(measurements).firstOrDefault(
      (measurement) => measurement.id === initValues.measurementId
    ),
    sourceEntity
  ) as [];

  if (sourceEntity) {
    /// TODO: probably use input helpers
  }

  return initValues;
};

const _buildNewPayload = (values: IFormValues) => {
  let payload: any = {};

  return payload;
};

const _buildEditedPayload = (
  values: IFormValues,
  sourceEntity: any | null | undefined
) => {
  let payload: any = {};

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
    console.log(values);
    const payload = _buildEditedPayload(values, targetOrderProfile);
    console.log(payload);
  };

  const onCreate = (values: IFormValues) => {
    console.log(values);
    const payload = _buildNewPayload(values);
    console.log(payload);
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        profileType: Yup.number().required(() => 'Profile type is required'),
        measurementId: Yup.number().required(() => 'Measurement is required'),
        fittingTypeId: Yup.number(),
        TEST: Yup.array(),
      })}
      initialValues={_initDefaultValues(props.measurements, targetOrderProfile)}
      onSubmit={(values: any) => {
        if (targetOrderProfile) onEdit(values);
        else onCreate(values);
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
                />

                <MeasurementInput
                  measurements={props.measurements}
                  formik={formik}
                  orderProfile={targetOrderProfile}
                />

                <FittingTypeInput formik={formik} />

                <FreshMeasurementInput
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
