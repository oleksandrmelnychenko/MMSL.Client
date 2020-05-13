import React, { useEffect } from 'react';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { PrimaryButton, liProperties } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { DealerAccount } from '../../interfaces';
import * as dealerActions from '../../redux/actions/dealer.actions';

export const DealerStores: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );
  const dealerStore = useSelector<IApplicationState, any[]>(
    (state) => state.dealer.dealerStores
  );
  useEffect(() => {
    dispatch(dealerActions.getStoresByDealer(selectedDealer.id));
  }, []);

  return (
    <div>
      <Text block>Dealer stores</Text>
      <PrimaryButton
        text="Add Store"
        onClick={() => {
          // TODO
          console.log('add');
        }}
        allowDisabledFocus
      />
      <ul>
        {dealerStore.map((store) => (
          <li>Store name: {store.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DealerStores;
