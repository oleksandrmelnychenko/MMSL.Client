import React, { useEffect, useState } from 'react';
import { List } from 'linq-typescript';
import { useSelector, useDispatch } from 'react-redux';

import {
  Separator,
  CommandBar,
  ICommandBarItemProps,
  Stack,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../../redux/reducers/index';
import { FormicReference } from '../../../interfaces';
import { DealerAccount } from '../../../interfaces/dealer';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import { IStore } from '../../../interfaces/store';
import FormStore from './FormStore';
import PanelTitle from '../panel/PanelTitle';
import {
  commandBarButtonStyles,
  commandBarStyles,
} from '../../../common/fabric-styles/styles';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { assignPendingActions } from '../../../helpers/action.helper';

export const DealerStores: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedStore, setSelectedStore] = useState<IStore | null | undefined>(
    null
  );
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );

  const targetDealer = useSelector<IApplicationState, DealerAccount | null>(
    (state) => state.dealerAccount.targetDealer
  );
  const dealerStores = useSelector<IApplicationState, IStore[]>(
    (state) => state.dealer.dealerStores
  );
  useEffect(() => {
    if (targetDealer) {
      dispatch(dealerActions.getStoresByDealer(targetDealer.id));
    }
  }, [targetDealer, dispatch]);

  useEffect(() => {
    if (dealerStores) {
      let toSelect = new List(dealerStores).firstOrDefault(
        (item) => item.id === selectedStore?.id
      );

      setSelectedStore(toSelect);
    }
  }, [dealerStores, selectedStore, setSelectedStore]);

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
          const selectedStore = new List(dealerStores).firstOrDefault(
            (store) => store.id === item.id
          );

          setSelectedStore(selectedStore);
          setIsOpenForm(true);
        }}
      >
        <div className="dealer__store__name">Name: {item.name}</div>
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
            controlActions.toggleCommonDialogVisibility(
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
        title="Stores"
        description={
          targetDealer ? [targetDealer.companyName, targetDealer.email] : null
        }
      />
      <div>
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />
      </div>
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack grow={1} tokens={{ maxWidth: '49%' }}>
          <Separator alignContent="start">Stores</Separator>
          <div className="dealer__stores">
            {dealerStores.map((item: IStore, index: number) => {
              return onRenderCell(item, index);
            })}{' '}
          </div>
        </Stack>

        <Stack grow={1} tokens={{ maxWidth: '49%' }}>
          {isOpenForm ? (
            <FormStore
              submitAction={(args: any) => {
                if (selectedStore) {
                  let action = assignPendingActions(
                    dealerActions.updateDealerStore(args)
                  );
                  dispatch(action);

                  setIsOpenForm(false);
                  setIsDirtyForm(false);
                  setSelectedStore(null);
                } else {
                  let action = assignPendingActions(
                    dealerActions.addStoreToCurrentDealer(args)
                  );
                  dispatch(action);

                  setIsOpenForm(false);
                  setIsDirtyForm(false);
                }
              }}
              formikReference={formikReference}
              store={selectedStore ? [selectedStore] : null}
            />
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};

export default DealerStores;
