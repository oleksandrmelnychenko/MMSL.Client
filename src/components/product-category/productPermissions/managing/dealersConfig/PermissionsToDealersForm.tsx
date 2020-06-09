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
    exploringDealer: null,
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
  const [detailsState, setDetailsState] = useState<DealerDetailsState>(
    DealerDetailsState.NotTouched
  );

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
      setDetailsState(DealerDetailsState.NotTouched);
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
            setDetailsState(DealerDetailsState.Assigning);
          }),
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            // formikReference.formik.submitForm();
            debugger;
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();
            setDetailsState(DealerDetailsState.NotTouched);
          }),
          GetCommandBarItemProps(CommandBarItem.Delete, () => {
            formikReference.formik.submitForm();
            setDetailsState(DealerDetailsState.Exploring);
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
          exploringDealer: Yup.object().nullable(),
          assignDealer: Yup.object().nullable(),
        })}
        initialValues={_initDefaultValues()}
        onSubmit={(values: any) => {
          if (values) {
            if (values.exploringDealer) {
            } else {
              console.log('TODO: unsuported case');
            }
          }
        }}
        onReset={(values: any, formikHelpers: any) => {}}
        innerRef={(formik: any) => {
          formikReference.formik = formik;

          if (formik) {
            setIsDismissDirty(formik.values.exploringDealer ? true : false);
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
                    selectedDealer={formik.values.exploringDealer}
                    onSelectDealerCallback={(
                      dealer: DealerAccount | null | undefined
                    ) => {
                      formik.setFieldValue('exploringDealer', dealer);
                      formik.setFieldTouched('exploringDealer');

                      formik.setFieldValue('assignDealer', null);
                      formik.setFieldTouched('assignDealer');

                      if (dealer) setDetailsState(DealerDetailsState.Exploring);
                      else setDetailsState(DealerDetailsState.NotTouched);
                    }}
                  />
                </Stack>
              </Stack.Item>

              <Stack.Item grow={1} styles={_columnStyle}>
                <Stack tokens={{ childrenGap: 6 }}>
                  <Separator alignContent="start">Dealer</Separator>
                  <DealerDetails
                    state={detailsState}
                    dealer={formik.values.exploringDealer}
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
