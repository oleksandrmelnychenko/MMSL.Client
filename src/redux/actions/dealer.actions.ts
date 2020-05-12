import * as dealerTypes from '../../constants/dealer.types.constants';
import { createAction } from '@reduxjs/toolkit';
import { DealerView } from '../reducers/dealer.reducer';
import { IDealer } from '../../interfaces';

export const changeDealerView = createAction<DealerView>(
  dealerTypes.CHANGE_DEALER_VIEW
);

export const getDealersList = createAction(dealerTypes.GET_DEALERS_LIST);

export const updateDealersList = createAction<IDealer[]>(
  dealerTypes.UPDATE_DEALERS_LIST
);

export type ChangeDealerView = ReturnType<typeof changeDealerView>;
export type GetDealersList = ReturnType<typeof getDealersList>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
