import React, { useState, useEffect } from 'react';
import { IApplicationState } from '../../../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { FabricVisibilities } from '../../../../interfaces/fabric';
import { FormicReference } from '../../../../interfaces';
import { fabricActions } from '../../../../redux/slices/store/fabric/fabric.slice';
import { rightPanelActions } from '../../../../redux/slices/rightPanel.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { List } from 'linq-typescript';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { Stack } from 'office-ui-fabric-react';
import FormCheckbox from '../../../../common/formFields/FormCheckbox';

export interface IFormValues {
  isMetresVisible: boolean;
  isMillVisible: boolean;
  isColorVisible: boolean;
  isCompositionVisible: boolean;
  isGSMVisible: boolean;
  isCountVisible: boolean;
  isWeaveVisible: boolean;
  isPatternVisible: boolean;
}

const _initDefaultValues = (fabricVisibilities: FabricVisibilities) => {
  const initValues: IFormValues = {
    isMetresVisible: true,
    isMillVisible: true,
    isColorVisible: true,
    isCompositionVisible: true,
    isGSMVisible: true,
    isCountVisible: true,
    isWeaveVisible: true,
    isPatternVisible: true,
  };

  initValues.isMetresVisible = fabricVisibilities.isMetresVisible;
  initValues.isMillVisible = fabricVisibilities.isMillVisible;
  initValues.isColorVisible = fabricVisibilities.isColorVisible;
  initValues.isCompositionVisible = fabricVisibilities.isCompositionVisible;
  initValues.isGSMVisible = fabricVisibilities.isGSMVisible;
  initValues.isCountVisible = fabricVisibilities.isCountVisible;
  initValues.isWeaveVisible = fabricVisibilities.isWeaveVisible;
  initValues.isPatternVisible = fabricVisibilities.isPatternVisible;

  return initValues;
};

const _buildEditedPayload = (values: IFormValues) => {
  let payload: FabricVisibilities = {
    isMetresVisible: values.isMetresVisible,
    isMillVisible: values.isMillVisible,
    isColorVisible: values.isColorVisible,
    isCompositionVisible: values.isCompositionVisible,
    isGSMVisible: values.isGSMVisible,
    isCountVisible: values.isCountVisible,
    isWeaveVisible: values.isWeaveVisible,
    isPatternVisible: values.isPatternVisible,
  };

  return payload;
};

const FabricPropsVisibilityForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.rightPanel.rightPanel.commandBarItems
  );

  const fabricVisibilities: FabricVisibilities = useSelector<
    IApplicationState,
    FabricVisibilities
  >((state) => state.fabric.fabricVisibilities);

  useEffect(() => {
    return () => {
      dispatch(fabricActions.changeTargetFabric(null));
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

  const onEdit = (values: IFormValues) => {
    const payload = _buildEditedPayload(values);

    dispatch(
      assignPendingActions(
        fabricActions.apiUpdateFabricVisibility(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            assignPendingActions(
              fabricActions.apiGetAllFabricsPaginated(),
              [],
              [],
              (args: any) => {
                dispatch(fabricActions.changeFabrics(args.entities));
                dispatch(
                  fabricActions.changePaginationInfo(args.paginationInfo)
                );
              },
              (args: any) => {}
            )
          );

          dispatch(rightPanelActions.closeRightPanel());
        },
        (args: any) => {}
      )
    );
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        isMetresVisible: Yup.boolean(),
        isMillVisible: Yup.boolean(),
        isColorVisible: Yup.boolean(),
        isCompositionVisible: Yup.boolean(),
        isGSMVisible: Yup.boolean(),
        isCountVisible: Yup.boolean(),
        isWeaveVisible: Yup.boolean(),
        isPatternVisible: Yup.boolean(),
      })}
      initialValues={_initDefaultValues(fabricVisibilities)}
      onSubmit={(values: any) => {
        onEdit(values);
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
          <Form>
            <Stack style={{ marginTop: '-21px' }}>
              <FormCheckbox
                formik={formik}
                label={'Metres'}
                fieldName={'isMetresVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'Mill'}
                fieldName={'isMillVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'Color'}
                fieldName={'isColorVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'Composition'}
                fieldName={'isCompositionVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'GSM'}
                fieldName={'isGSMVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'Count'}
                fieldName={'isCountVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'Weave'}
                fieldName={'isWeaveVisible'}
              />
              <FormCheckbox
                formik={formik}
                label={'Pattern'}
                fieldName={'isPatternVisible'}
              />
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FabricPropsVisibilityForm;
