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
import { DealerAccount } from '../../../interfaces';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import { IStore } from '../../../interfaces/index';
import { Stack } from 'office-ui-fabric-react';
import FormStore from './FormStore';
import PanelTitle from '../panel/PanelTitle';
import { FormicReference } from '../dealerManaging/ManageDealerForm';
import { commandBarButtonStyles } from '../../../common/fabric-styles/styles';

export const DealerStores: React.FC = () => {
  const dispatch = useDispatch();
  const [formikReference] = useState<FormicReference>(new FormicReference());
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );
  const dealerStores = useSelector<IApplicationState, IStore[]>(
    (state) => state.dealer.dealerStores
  );
  useEffect(() => {
    dispatch(dealerActions.getStoresByDealer(selectedDealer.id));
  }, []);

  const [selectedStore, setSelectedStore] = useState<IStore[] | null>(null);

  const [isOpenForm, setIsOpenForm] = useState(false);

  const onRenderCell = (
    item: IStore,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div
        key={index}
        className={`dealer__store${
          selectedStore && item.id === selectedStore[0].id ? ' selected' : ''
        }`}
        onClick={() => {
          const selectedStore = dealerStores.filter(
            (store) => store.id === item.id
          );

          setSelectedStore(selectedStore);
          setIsOpenForm(true);
        }}>
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
      iconProps: { iconName: 'Save' },
      onClick: () => {
        formikReference.formik.submitForm();
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Reset',
      text: 'Reset',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      onClick: () => {
        if (selectedStore) {
          dispatch(
            dealerActions.deleteCurrentDealerStore(
              selectedStore[0].id as number
            )
          );
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
  ];

  const commandBarStyles = {
    root: {
      background: '#edebe9',
      borderRadius: '6px',
      marginBottom: '30px',
    },
    primarySet: {
      color: '#323130',
      'justify-content': 'flex-end',
    },
  };

  return (
    <div>
      <PanelTitle
        title={`Dealer: ${selectedDealer.companyName} | ${selectedDealer.email}`}
      />
      <div>
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />
      </div>
      <Stack horizontal tokens={{ childrenGap: 20 }}>
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
          {isOpenForm ? (
            <FormStore
              formikReference={formikReference}
              store={selectedStore}
            />
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};

export default DealerStores;
