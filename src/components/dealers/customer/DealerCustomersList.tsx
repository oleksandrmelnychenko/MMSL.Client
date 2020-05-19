import React, { useState } from 'react';
import {
  FocusZone,
  FocusZoneDirection,
  Separator,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { StoreCustomer } from '../../../interfaces';
import { List } from 'linq-typescript';
import * as dealerActions from '../../../redux/actions/dealer.actions';

export const DealerCustomersList: React.FC = () => {
  const dispatch = useDispatch();

  const [selectedStoreCustomer, setSelectedStoreCustomer] = useState<
    StoreCustomer | null | undefined
  >(null);

  const storeCustomers = useSelector<IApplicationState, StoreCustomer[]>(
    (state) => state.dealer.dealerCustomerState.storeCustomers
  );

  const onRenderCell = (
    item: StoreCustomer,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div
        key={index}
        className={`dealer__store${
          selectedStoreCustomer && item.id === selectedStoreCustomer.id
            ? ' selected'
            : ''
        }`}
        onClick={() => {
          const selectedCustomer = new List(storeCustomers).firstOrDefault(
            (storeCustomer) => storeCustomer.id === item.id
          );
          setSelectedStoreCustomer(selectedCustomer);
          if (selectedCustomer) {
            dispatch(
              dealerActions.setSelectedCustomerInCurrentStore(selectedCustomer)
            );
          }
        }}>
        <div className="dealer__store__name">User name: {item.userName}</div>
        <div className="dealer__store__address">
          Customer name: {`${item.customerName}`}
        </div>
      </div>
    );
  };

  return (
    <div>
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={'dealer__stores'} data-is-scrollable={true}>
          <Separator alignContent="start">Customers</Separator>
          {storeCustomers.map((item: StoreCustomer, index: number) => {
            return onRenderCell(item, index);
          })}{' '}
        </div>
      </FocusZone>
    </div>
  );
};

export default DealerCustomersList;
