import * as dealerTypes from '../../constants/dealer.types.constants';
import { createAction } from '@reduxjs/toolkit';
import { IDealer } from '../../interfaces';

export const getDealersList = createAction(dealerTypes.GET_DEALERS_LIST);

export const updateDealersList = createAction<IDealer[]>(
  dealerTypes.UPDATE_DEALERS_LIST
);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
