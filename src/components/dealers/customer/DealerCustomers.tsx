import React, { useEffect, useState } from 'react';
import {
  FocusZone,
  FocusZoneDirection,
  Separator,
  CommandBar,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { DealerAccount, FormicReference } from '../../../interfaces';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import { IStore } from '../../../interfaces/index';
import { Stack } from 'office-ui-fabric-react';
// import FormStore from './FormStore';
import PanelTitle from '../panel/PanelTitle';
import DealerCustomersList from './DealerCustomersList';
import {
  commandBarButtonStyles,
  commandBarStyles,
} from '../../../common/fabric-styles/styles';
import * as controlAction from '../../../redux/actions/control.actions';
import {
  DialogArgs,
  CommonDialogType,
} from '../../../redux/reducers/control.reducer';
import { List } from 'linq-typescript';

export const DealerCustomers: React.FC = () => {
  const dispatch = useDispatch();
  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );
  const dealerStores = useSelector<IApplicationState, IStore[]>(
    (state) => state.dealer.dealerStores
  );
  useEffect(() => {
    if (selectedDealer) {
      dispatch(dealerActions.getStoresByDealer(selectedDealer.id));
    }
  }, [selectedDealer, dispatch]);

  const [selectedStore, setSelectedStore] = useState<IStore | null | undefined>(
    null
  );

  const [isOpenForm, setIsOpenForm] = useState(false);

  const onRenderCell = (
    item: IStore,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div
        key={index}
        className={`dealer__store${
          selectedStore && item.id === selectedStore.id ? ' selected' : ''
        }`}
        onClick={() => {
          //   const selectedStore = dealerStores.filter(
          //     (store) => store.id === item.id
          //   );

          const selectedStore = new List<IStore>(dealerStores).firstOrDefault(
            (store) => store.id === item.id
          );

          setSelectedStore(selectedStore);

          if (selectedStore && selectedStore.id) {
            dispatch(
              dealerActions.getStoreCustomersByStoreId(selectedStore.id)
            );
            setIsOpenForm(true);
          } else {
            setIsOpenForm(false);
            dispatch(dealerActions.updateTargetStoreStoreCustomersList([]));
          }
        }}
      >
        <div className="dealer__store__name">Store name: {item.name}</div>
        <div className="dealer__store__address">
          Address:{' '}
          {`country: ${item.address.country}, city: ${item.address.city}`}
        </div>
      </div>
    );
  };

  const _items: ICommandBarItemProps[] = [
    {
      key: 'New',
      text: 'New',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        setSelectedStore(null);
        setIsOpenForm(true);
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
      disabled: selectedStore ? false : true,
      onClick: () => {
        if (selectedStore) {
          dispatch(
            controlAction.toggleCommonDialogVisibility(
              new DialogArgs(
                CommonDialogType.Delete,
                'Delete store',
                `Are you sure you want to delete ${selectedStore.name}?`,
                () => {
                  if (selectedStore) {
                    dispatch(
                      dealerActions.deleteCurrentDealerStore(
                        selectedStore.id as number
                      )
                    );
                  }
                  formikReference.formik.resetForm();
                  setSelectedStore(null);
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
        title={
          selectedDealer
            ? `Customers: ${selectedDealer.companyName} | ${selectedDealer.email}`
            : ''
        }
      />
      <div>
        {/* <CommandBar

          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        /> */}
      </div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack grow={1} tokens={{ maxWidth: '50%' }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Stores</Separator>
              {dealerStores.map((item: IStore, index: number) => {
                return onRenderCell(item, index);
              })}{' '}
            </div>
          </FocusZone>
        </Stack>

        <Stack grow={1} tokens={{ maxWidth: '50%' }}>
          {/* {isOpenForm ? <DealerCustomersList /> : null} */}
          <DealerCustomersList />
        </Stack>
      </Stack>
    </div>
  );
};

export default DealerCustomers;
