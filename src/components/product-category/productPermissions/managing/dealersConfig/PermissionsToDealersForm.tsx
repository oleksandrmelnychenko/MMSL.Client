import React, { useState, useEffect } from 'react';
import { Stack, Separator } from 'office-ui-fabric-react';
import { FormicReference } from '../../../../../interfaces';
import { DealerAccount } from '../../../../../interfaces/dealer';
import { ProductCategory } from '../../../../../interfaces/products';
import { ProductPermissionSettings } from '../../../../../interfaces/products';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import {
  controlActions,
  CommonDialogType,
} from '../../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledStatePartialy,
} from '../../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../../redux/reducers';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../../../redux/slices/productStylePermissions.slice';
import AssignedDealersList from './AssignedDealersList';
import DealerDetails, { DealerDetailsState } from './DealerDetails';
import { Formik } from 'formik';
import * as Yup from 'yup';

const _columnStyle = { root: { maxWidth: '49%', minWidth: '49%' } };

const _initDefaultValues = () => {
  const initValues: any = {
    exploringDealer: null,
    assignDealer: null,
  };

  return initValues;
};

const _buildPayload = (
  permission: ProductPermissionSettings,
  dealer: DealerAccount,
  isDismiss: boolean
) => {
  let payload: any = {
    productPermissionSettingId: permission.id,
    dealers: [
      {
        dealerAccountId: dealer.id,
        isDeleted: isDismiss,
      },
    ],
  };

  return payload;
};

export const DealersListContext = React.createContext({});

export const PermissionsToDealersForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [assignDirtyRules, setAssignDirtyRules] = useState<boolean>(false);
  const [dismissDirtyRules, setDismissDirtyRules] = useState<boolean>(false);
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

  const permissionSettings = useSelector<
    IApplicationState,
    ProductPermissionSettings[]
  >((state) => state.productStylePermissions.permissionSettings);

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
            formikReference.formik.submitForm();
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
          ChangeItemsDisabledStatePartialy(commandBarItems, [
            { command: CommandBarItem.New, isDisabled: false },
            { command: CommandBarItem.Reset, isDisabled: !assignDirtyRules },
            { command: CommandBarItem.Save, isDisabled: !assignDirtyRules },
            { command: CommandBarItem.Delete, isDisabled: !dismissDirtyRules },
          ])
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignDirtyRules, dismissDirtyRules]);

  useEffect(() => {
    if (formikReference.formik) {
      formikReference.formik.resetForm();
    }

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

  const onUpdate = (payload: any) => {
    dispatch(
      assignPendingActions(
        productStylePermissionsActions.apiBindDealersToPermission(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            productStylePermissionsActions.updatePermissionSettingsList(
              new List(permissionSettings)
                .select((item) => {
                  let result = item;
                  if (item.id === args.body.id) {
                    result = args.body;
                  }
                  return result;
                })
                .toArray()
            )
          );
          dispatch(
            productStylePermissionsActions.changeEditingPermissionSetting(
              args.body
            )
          );
        },
        (args: any) => {}
      )
    );
  };

  const assignSetting = (dealerToAssign: DealerAccount) => {
    if (productCategory && editingPermission) {
      const payload = _buildPayload(editingPermission, dealerToAssign, false);
      onUpdate(payload);
    }
  };

  const onDismissDealer = (dealerToDismiss: DealerAccount) => {
    if (productCategory && editingPermission) {
      dispatch(
        controlActions.toggleCommonDialogVisibility({
          dialogType: CommonDialogType.Delete,
          title: 'Dismiss dealer',
          subText: `Are you sure you want to dismiss ${dealerToDismiss.companyName} dealer from current style permission?`,
          onSubmitClick: () => {
            if (productCategory && editingPermission) {
              const payload = _buildPayload(
                editingPermission,
                dealerToDismiss,
                true
              );
              onUpdate(payload);
            }
          },
          onDeclineClick: () => {},
        })
      );
    }
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
              onDismissDealer(values.exploringDealer);
            } else if (values.assignDealer) {
              assignSetting(values.assignDealer);
            }
          }
        }}
        onReset={(values: any, formikHelpers: any) => {
          setDetailsState(DealerDetailsState.NotTouched);
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;

          if (formik) {
            if (detailsState === DealerDetailsState.Assigning) {
              setAssignDirtyRules(
                formikReference.formik.values.assignDealer ? true : false
              );
              setDismissDirtyRules(false);
            } else if (detailsState === DealerDetailsState.Exploring) {
              setAssignDirtyRules(false);
              setDismissDirtyRules(
                formikReference.formik.values.exploringDealer ? true : false
              );
            } else if (detailsState === DealerDetailsState.NotTouched) {
              setAssignDirtyRules(false);
              setDismissDirtyRules(false);
            }
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
                <Stack tokens={{ childrenGap: 9 }}>
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
                <Stack tokens={{ childrenGap: 9 }}>
                  <Separator alignContent="start">Dealer</Separator>
                  <DealerDetails
                    product={productCategory}
                    state={detailsState}
                    dealer={formik.values.exploringDealer}
                    onBeginSearchCallback={() => {
                      if (formik.values.exploringDealer) {
                        formik.setFieldValue('exploringDealer', null);
                        formik.setFieldTouched('exploringDealer');
                      }
                      if (detailsState !== DealerDetailsState.Assigning) {
                        setDetailsState(DealerDetailsState.Assigning);
                      }
                    }}
                    onChooseSuggestionDealerCallback={(
                      dealer: DealerAccount | null | undefined
                    ) => {
                      if (dealer) {
                        const alreadyAssignedDealer = new List(
                          assignedDealers
                        ).firstOrDefault(
                          (dealerItem) => dealerItem.id === dealer.id
                        );

                        if (alreadyAssignedDealer) {
                          setDetailsState(DealerDetailsState.Exploring);

                          formik.setFieldValue('exploringDealer', dealer);
                          formik.setFieldTouched('exploringDealer');

                          formik.setFieldValue('assignDealer', null);
                          formik.setFieldTouched('assignDealer');
                        } else {
                          formik.setFieldValue('exploringDealer', null);
                          formik.setFieldTouched('exploringDealer');

                          formik.setFieldValue('assignDealer', dealer);
                          formik.setFieldTouched('assignDealer');
                        }
                      } else {
                        setDetailsState(DealerDetailsState.NotTouched);
                      }
                    }}
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
