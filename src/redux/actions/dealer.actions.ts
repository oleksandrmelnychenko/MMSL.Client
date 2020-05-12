import * as dealerTypes from '../../constants/dealer.types.constants';
import { createAction } from '@reduxjs/toolkit';
import { DealerView } from '../reducers/dealer.reducer';

export const changeDealerView = createAction<DealerView>(
  dealerTypes.CHANGE_DEALER_VIEW
);

export type ChangeDealerView = ReturnType<typeof changeDealerView>;
