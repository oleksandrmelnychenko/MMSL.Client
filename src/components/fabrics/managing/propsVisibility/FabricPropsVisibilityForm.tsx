import React, { useState, useEffect } from 'react';
import { IApplicationState } from '../../../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { Fabric } from '../../../../interfaces/fabric';
import { FormicReference } from '../../../../interfaces';
import {
  fabricActions,
  IFabricState,
} from '../../../../redux/slices/store/fabric/fabric.slice';
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

const _initDefaultValues = (sourceFabrics: Fabric[]) => {
  const initValues: IFormValues = {
    isMetresVisible: false,
    isMillVisible: false,
    isColorVisible: false,
    isCompositionVisible: false,
    isGSMVisible: false,
    isCountVisible: false,
    isWeaveVisible: false,
    isPatternVisible: false,
  };

  if (sourceFabrics.length > 0) {
    initValues.isMetresVisible = sourceFabrics[0].isMetresVisible;
    initValues.isMillVisible = sourceFabrics[0].isMillVisible;
    initValues.isColorVisible = sourceFabrics[0].isColorVisible;
    initValues.isCompositionVisible = sourceFabrics[0].isCompositionVisible;
    initValues.isGSMVisible = sourceFabrics[0].isGSMVisible;
    initValues.isCountVisible = sourceFabrics[0].isCountVisible;
    initValues.isWeaveVisible = sourceFabrics[0].isWeaveVisible;
    initValues.isPatternVisible = sourceFabrics[0].isPatternVisible;
  }

  return initValues;
};

const _buildEditedPayload = (values: IFormValues) => {
  let payload: any = {
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

  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

  const fabricState: IFabricState = useSelector<
    IApplicationState,
    IFabricState
  >((state) => state.fabric);

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

  const onEdit = (values: IFormValues, sourceFabrics: Fabric[]) => {
    const payload = _buildEditedPayload(values);

    dispatch(
      assignPendingActions(
        fabricActions.apiUpdateFabricVisibility(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            assignPendingActions(
              fabricActions.apiGetAllFabrics({
                paginationPageNumber:
                  fabricState.pagination.paginationInfo.pageNumber,
                paginationLimit: fabricState.pagination.limit,

                searchPhrase: fabricState.searchWord,
                filterBuilder: fabricState.filters,
              }),
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
      initialValues={_initDefaultValues(fabrics)}
      onSubmit={(values: any) => {
        if (fabrics) onEdit(values, fabrics);
      }}
      innerRef={(formik: any) => {
        formikReference.formik = formik;
        if (formik) setFormikDirty(formik.dirty && fabrics.length > 0);
      }}
      validateOnBlur={false}
      enableReinitialize={true}
    >
      {(formik) => {
        return (
          <Form>
            <Stack>
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
