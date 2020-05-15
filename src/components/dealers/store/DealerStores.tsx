import React, { useEffect, useState } from 'react';
import { Text } from 'office-ui-fabric-react/lib/Text';
import {
  PrimaryButton,
  FocusZone,
  FocusZoneDirection,
  Separator,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { DealerAccount } from '../../../interfaces';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import { IStore } from '../../../interfaces/index';
import { Stack } from 'office-ui-fabric-react';
import FormStore from './FormStore';

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

  const [selectedStore, setSelectedStore] = useState<IStore[] | null>(null);

  const [isOpenForm, setIsOpenForm] = useState(false);

  console.log(selectedStore);

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

  const btnStyles = {
    root: { marginTop: '20px' },
  };

  return (
    <div>
      <Text block className="dealer__title">
        Dealer: {`${selectedDealer.companyName} | ${selectedDealer.email}`}
      </Text>
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
          <Stack>
            <PrimaryButton
              styles={btnStyles}
              text="Add Store"
              onClick={() => {
                setSelectedStore(null);
                setIsOpenForm(true);
              }}
              allowDisabledFocus
            />
          </Stack>
        </Stack>

        <Stack grow={1} tokens={{ maxWidth: '50%' }}>
          {isOpenForm ? <FormStore store={selectedStore} /> : null}
        </Stack>
      </Stack>
    </div>
  );
};

export default DealerStores;
