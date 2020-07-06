import React, { useEffect, useState } from 'react';
import {
  FocusZone,
  FocusZoneDirection,
  Separator,
  ICommandBarItemProps,
  CommandBar,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { FormicReference } from '../../../interfaces';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import { IStore } from '../../../interfaces/store';
import { Stack } from 'office-ui-fabric-react';
import PanelTitle from '../../../common/panel/PanelTitle';
import DealerCustomersList from './DealerCustomersList';
import {
  commandBarButtonStyles,
  commandBarStyles,
} from '../../../common/fabric-styles/styles';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { List } from 'linq-typescript';
import ManageDealerCustomerForm from './ManageDealerCustomerForm';
import { customerActions } from '../../../redux/slices/customer/customer.slice';
import { DealerState } from '../../../redux/slices/dealer.slice';

export const DealerCustomers: React.FC = () => {
  const dispatch = useDispatch();
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const [selectedLocalStore, setSelectedLocalStore] = useState<
    IStore | null | undefined
  >(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );

  const { selectedDealer, dealerStores, dealerCustomerState } = useSelector<
    IApplicationState,
    DealerState
  >((state) => state.dealer);

  useEffect(() => {
    if (selectedDealer) {
      dispatch(dealerActions.getStoresByDealer(selectedDealer.id));
    }
  }, [selectedDealer, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(dealerActions.setSelectedCustomerInCurrentStore(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRenderCell = (
    item: IStore,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div
        key={index}
        className={`dealer__store${
          selectedLocalStore && item.id === selectedLocalStore.id
            ? ' selected'
            : ''
        }`}
        onClick={() => {
          const selectedStore = new List<IStore>(dealerStores).firstOrDefault(
            (store) => store.id === item.id
          );
          if (dealerCustomerState.selectedCustomer) {
            dispatch(dealerActions.setSelectedCustomerInCurrentStore(null));
          }
          setSelectedLocalStore(selectedStore);

          if (selectedStore && selectedStore.id) {
            dispatch(
              dealerActions.getStoreCustomersByStoreId(selectedStore.id)
            );
          } else {
            dispatch(dealerActions.updateTargetStoreCustomersList([]));
          }
        }}
      >
        <div className="dealer__store__name">Name: {item.name}</div>
        <div className="dealer__store__address">
          Address:{' '}
          {`country: ${item.address.country}, city: ${item.address.city}`}
        </div>
        <div className="dealer__store__counter">{item.storeCustomersCount}</div>
      </div>
    );
  };

  const _items: ICommandBarItemProps[] = [
    {
      key: 'New',
      text: 'New',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        if (selectedLocalStore) {
          setIsOpenForm(true);
          dispatch(dealerActions.setSelectedCustomerInCurrentStore(null));
        } else {
          dispatch(
            controlActions.toggleCommonDialogVisibility(
              new DialogArgs(
                CommonDialogType.Common,
                'Information',
                `Select a store to create in it customers`,
                () => {
                  dispatch(controlActions.toggleCommonDialogVisibility(null));
                },
                () => {}
              )
            )
          );
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Save',
      text: 'Save',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Save' },
      onClick: () => {
        formikReference.formik.submitForm();
        if (formikReference?.formik && formikReference.formik.isValid) {
          if (!dealerCustomerState.selectedCustomer) {
            setIsOpenForm(false);
            setIsDirtyForm(false);
            dispatch(dealerActions.setSelectedCustomerInCurrentStore(null));
          }
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Reset',
      text: 'Reset',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        formikReference.formik.resetForm();
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      disabled: dealerCustomerState.selectedCustomer ? false : true,
      onClick: () => {
        if (selectedLocalStore && dealerCustomerState.selectedCustomer) {
          dispatch(
            controlActions.toggleCommonDialogVisibility(
              new DialogArgs(
                CommonDialogType.Delete,
                'Delete store',
                `Are you sure you want to delete ${dealerCustomerState.selectedCustomer.customerName}?`,
                () => {
                  dispatch(
                    dealerActions.deleteCurrentCustomerFromStore(
                      dealerCustomerState.selectedCustomer!.id
                    )
                  );
                  dispatch(
                    dealerActions.setSelectedCustomerInCurrentStore(null)
                  );
                  dispatch(dealerActions.getStoresByDealer(selectedDealer!.id));

                  setIsOpenForm(false);
                },
                () => {}
              )
            )
          );
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
  ];
  return (
    <div>
      <PanelTitle
        title={'Customers'}
        description={
          selectedDealer
            ? [selectedDealer.companyName, selectedDealer.email]
            : null
        }
      />
      <div>
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />
      </div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack grow={1} tokens={{ maxWidth: '32%' }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Stores</Separator>
              {dealerStores.map((item: IStore, index: number) => {
                return onRenderCell(item, index);
              })}{' '}
            </div>
          </FocusZone>
        </Stack>

        <Stack grow={1} tokens={{ maxWidth: '32%' }}>
          <DealerCustomersList />
        </Stack>
        <Stack grow={1} tokens={{ maxWidth: '32%' }}>
          {(selectedLocalStore && isOpenForm) ||
          (selectedLocalStore && dealerCustomerState.selectedCustomer) ? (
            <>
              <Separator alignContent="start">Customers form</Separator>
              <ManageDealerCustomerForm
                formikReference={formikReference}
                submitAction={(args: any) => {
                  debugger;
                  const value = { ...args, storeId: selectedLocalStore.id };
                  if (dealerCustomerState.selectedCustomer) {
                    dispatch(
                      dealerActions.updateStoreCustomer({
                        ...value,
                        id: dealerCustomerState.selectedCustomer.id,
                      })
                    );
                  } else {
                    dispatch(customerActions.saveNewCustomer(value));
                    dispatch(
                      dealerActions.getStoreCustomersByStoreId(
                        selectedLocalStore.id!
                      )
                    );
                    dispatch(
                      dealerActions.getStoresByDealer(selectedDealer!.id)
                    );
                  }
                  formikReference.formik?.resetForm();
                }}
                customer={dealerCustomerState.selectedCustomer}
              />
            </>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};

export default DealerCustomers;
