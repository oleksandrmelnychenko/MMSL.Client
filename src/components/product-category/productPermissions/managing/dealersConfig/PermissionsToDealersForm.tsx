import React, { useState, useEffect } from 'react';
import { Stack, TextField, Separator, Label } from 'office-ui-fabric-react';
import {
  FormicReference,
  ProductCategory,
  ProductPermissionSettings,
  DealerAccount,
} from '../../../../../interfaces';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../../redux/reducers';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../../../redux/slices/productStylePermissions.slice';
import AssignedDealersList from './AssignedDealersList';
import DealerDetails, { DealerDetailsState } from './DealerDetails';
import { Formik } from 'formik';
import * as Yup from 'yup';

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

const _initDefaultValues = () => {
  const initValues: any = {
    dismissDealer: null,
    assignDealer: null,
  };

  return initValues;
};

export const DealersListContext = React.createContext({});

export const PermissionsToDealersForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isDismissDirty, setIsDismissDirty] = useState<boolean>(false);
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
            formikReference.formik.resetForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            // formikReference.formik.submitForm();
            debugger;
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            // formikReference.formik.resetForm();
            debugger;
          }),
          GetCommandBarItemProps(CommandBarItem.Delete, () => {
            formikReference.formik.submitForm();
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
            [CommandBarItem.Delete],
            !isDismissDirty
          )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDismissDirty]);

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

  const onDismissDealer = (dealerToDismiss: DealerAccount) => {
    dispatch(
      controlActions.toggleCommonDialogVisibility(
        new DialogArgs(
          CommonDialogType.Delete,
          'Dismiss dealer',
          `Are you sure you want to dismiss ${dealerToDismiss.companyName} dealer from current style permission?`,
          () => {
            if (dealerToDismiss) {
              console.log('TODO: dismiss dealer');
            } else {
              console.log(
                'TODO: cant resolve dealer to dismiss (after accept)'
              );
            }
          },
          () => {}
        )
      )
    );
  };

  return (
    <div className="permissionsToDealersForm">
      <Formik
        validationSchema={Yup.object().shape({
          dismissDealer: Yup.object().nullable(),
          assignDealer: Yup.object().nullable(),
        })}
        initialValues={_initDefaultValues()}
        onSubmit={(values: any) => {
          if (values) {
            if (values.dismissDealer) {
            } else {
              console.log('TODO: unsuported case');
            }
          }
        }}
        onReset={(values: any, formikHelpers: any) => {}}
        innerRef={(formik: any) => {
          formikReference.formik = formik;

          if (formik) {
            setIsDismissDirty(formik.values.dismissDealer ? true : false);
            /// TODO: dont forget about other `dirty` state
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Stack
              horizontal
              horizontalAlign="space-between"
              tokens={{ childrenGap: 20 }}
            >
              <Stack.Item grow={1} styles={_columnStyle}>
                <Stack tokens={{ childrenGap: 6 }}>
                  <Separator alignContent="start">Assigned Dealers</Separator>
                  <AssignedDealersList
                    dealers={assignedDealers}
                    selectedDealer={formik.values.dismissDealer}
                    onSelectDealerCallback={(
                      dealer: DealerAccount | null | undefined
                    ) => {
                      formik.setFieldValue('dismissDealer', dealer);
                      formik.setFieldTouched('dismissDealer');

                      formik.setFieldValue('assignDealer', null);
                      formik.setFieldTouched('assignDealer');
                    }}
                  />
                </Stack>
              </Stack.Item>

              <Stack.Item grow={1} styles={_columnStyle}>
                <Stack tokens={{ childrenGap: 6 }}>
                  <Separator alignContent="start">Dealer</Separator>
                  <DealerDetails
                    formikReference={formikReference}
                    state={DealerDetailsState.Explore}
                    dealer={null}
                  />
                </Stack>
              </Stack.Item>
            </Stack>
          );
        }}
      </Formik>
    </div>
  );
};

export default PermissionsToDealersForm;
