import React, { useEffect, useState } from 'react';
import { Text } from 'office-ui-fabric-react/lib/Text';
import {
  PrimaryButton,
  FocusZone,
  FocusZoneDirection,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { DealerAccount } from '../../interfaces';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { IStore } from '../../interfaces/index';
import { Stack } from 'office-ui-fabric-react';
import FormStore from './store/FormStore';

export const DealerStores: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );
  const dealerStores = useSelector<IApplicationState, IStore[]>(
    (state) => state.dealer.dealerStores
  );
  useEffect(() => {
    dispatch(dealerActions.getStoresByDealer(selectedDealer.id));
  }, []);

  const [store, setStore] = useState<IStore[] | null>(null);
  const [nstore, setNstore] = useState<IStore[] | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const onRenderCell = (
    item: IStore,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div
        key={index}
        className="dealer__store"
        onClick={() => {
          const selectedStore = dealerStores.filter(
            (store) => store.id === item.id
          );
          setStore(selectedStore);
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

  return (
    <div>
      <Text
        block
        className="dealer__title">{`${selectedDealer.companyName} / ${selectedDealer.email}`}</Text>
      <PrimaryButton
        text="Add Store"
        onClick={() => {
          setStore(null);
          setIsOpenForm(true);
        }}
        allowDisabledFocus
      />
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack grow={1} tokens={{ maxWidth: '50%' }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              {dealerStores.map((item: IStore, index: number) => {
                return onRenderCell(item, index);
              })}{' '}
            </div>
          </FocusZone>
        </Stack>
        <Stack grow={1} tokens={{ maxWidth: '50%' }}>
          {isOpenForm ? <FormStore store={store} /> : null}
        </Stack>
      </Stack>
    </div>
  );
};

export default DealerStores;
