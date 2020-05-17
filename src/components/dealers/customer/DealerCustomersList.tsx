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
import {
  DealerAccount,
  FormicReference,
  StoreCustomer,
} from '../../../interfaces';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import { IStore } from '../../../interfaces/index';
import { Stack } from 'office-ui-fabric-react';
// import FormStore from './FormStore';
import PanelTitle from '../panel/PanelTitle';
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

export const DealerCustomersList: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [selectedStoreCustomer, setSelectedStoreCustomer] = useState<
    StoreCustomer | null | undefined
  >(null);

  const storeCustumers = useSelector<IApplicationState, StoreCustomer[]>(
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
          const selectedCustomer = new List(storeCustumers).firstOrDefault(
            (storeCustomer) => storeCustomer.id === item.id
          );

          setSelectedStoreCustomer(selectedCustomer);
        }}
      >
        <div className="dealer__store__name">Store name: {item.userName}</div>
        <div className="dealer__store__address">
          Company name: {`${item.customerName}`}
        </div>
      </div>
    );
  };

  return (
    <div>
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={'dealer__stores'} data-is-scrollable={true}>
          <Separator alignContent="start">Customers</Separator>
          {storeCustumers.map((item: StoreCustomer, index: number) => {
            return onRenderCell(item, index);
          })}{' '}
        </div>
      </FocusZone>
    </div>
  );
};

export default DealerCustomersList;
