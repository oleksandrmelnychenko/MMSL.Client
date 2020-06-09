import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Separator, Label } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  ProductCategory,
  ProductPermissionSettings,
  DealerAccount,
} from '../../../../../interfaces';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../../redux/reducers';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../../../redux/slices/productStylePermissions.slice';
import AssignedDealersList from './AssignedDealersList';

const _columnStyle = { root: { maxWidth: '49%', minWidth: '49%' } };

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
  sourceEntity?: ProductPermissionSettings | null
) => {
  const initValues: any = {};

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

export const PermissionsToDealersForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [assignedDealers, setAssignedDealers] = useState<DealerAccount[]>([]);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const productCategory = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const editingPermission = useSelector<
    IApplicationState,
    ProductPermissionSettings | null | undefined
  >((state) => state.productStylePermissions.editingPermissionSetting);

  /// Disposing form
  useEffect(() => {
    return () => {
      setAssignedDealers([]);
      dispatch(
        productStylePermissionsActions.changeEditingPermissionSetting(null)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.New, () => {
            debugger;
          }),
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Delete, () => {
            debugger;
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

  useEffect(() => {
    if (editingPermission) {
      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiGetDealersByPermissionId(
            editingPermission.id
          ),
          [],
          [],
          (args: any) => {
            setAssignedDealers(args);
          },
          (args: any) => {
            setAssignedDealers([]);
          }
        )
      );
    } else {
      setAssignedDealers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPermission]);

  const editSetting = () => {
    if (productCategory && editingPermission) {
      //   const payload = _buildEditedPayload(values, editingSetting);
    }
  };

  return (
    <div className="permissionsToDealersForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          description: Yup.string(),
        })}
        initialValues={_initDefaultValues(editingPermission)}
        onSubmit={(values: any) => {
          if (editingPermission) editSetting();
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
            <Form>
              <Stack
                horizontal
                horizontalAlign="space-between"
                tokens={{ childrenGap: 20 }}
              >
                <Stack.Item grow={1} styles={_columnStyle}>
                  <Stack tokens={{ childrenGap: 6 }}>
                    <Separator alignContent="start">Assigned Dealers</Separator>
                    <AssignedDealersList dealers={assignedDealers} />
                  </Stack>
                </Stack.Item>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PermissionsToDealersForm;
