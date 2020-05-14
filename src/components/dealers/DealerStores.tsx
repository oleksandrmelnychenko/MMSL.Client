import React, { useEffect } from 'react';
import { Text } from 'office-ui-fabric-react/lib/Text';
import {
  PrimaryButton,
  FocusZone,
  List,
  FocusZoneDirection,
  ImageFit,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { DealerAccount } from '../../interfaces';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { IStore } from '../../interfaces/index';
import { Stack } from 'office-ui-fabric-react';

export const DealerStores: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );
  const dealerStore = useSelector<IApplicationState, IStore[]>(
    (state) => state.dealer.dealerStores
  );
  useEffect(() => {
    dispatch(dealerActions.getStoresByDealer(selectedDealer.id));
  }, []);

  const onRenderCell = (
    item: IStore,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div className="dealer__store">
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
        className="dealer__title">{`Dealer: ${selectedDealer.companyName}`}</Text>
      <PrimaryButton
        text="Add Store"
        onClick={() => {
          // TODO
          console.log('add');
        }}
        allowDisabledFocus
      />
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <Stack grow={1}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              {dealerStore.map((item: IStore, index: number) => {
                return onRenderCell(item, index);
              })}{' '}
            </div>
          </FocusZone>
        </Stack>
        <Stack grow={3}></Stack>
        <Stack grow={1}></Stack>
      </Stack>
    </div>
  );
};

export default DealerStores;
