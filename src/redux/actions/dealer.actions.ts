import * as dealerTypes from '../../constants/dealer.types.constants';
import { createAction } from '@reduxjs/toolkit';
import { IDealer } from '../../interfaces';
import { DealerAccount } from '../../components/dealers/DealerDetails';

export const getDealersList = createAction(dealerTypes.GET_DEALERS_LIST);

export const updateDealersList = createAction<IDealer[]>(
  dealerTypes.UPDATE_DEALERS_LIST
);

export const saveNewDealer = createAction<DealerAccount>(
  dealerTypes.SAVE_NEW_DEALER
);

export type GetDealersList = ReturnType<typeof getDealersList>;
export type UpdateDealersList = ReturnType<typeof updateDealersList>;
export type SaveNewDealer = ReturnType<typeof saveNewDealer>;
