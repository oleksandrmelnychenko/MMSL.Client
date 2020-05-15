import { CurrencyF } from './../../interfaces/index';
import { createAction } from '@reduxjs/toolkit';
import * as unitsTypes from '../../constants/units.types.constants';

export const getCurrencies = createAction(unitsTypes.GET_CURRENCIES);
export const setCurrencies = createAction<CurrencyF>(unitsTypes.SET_CURRENCIES);

export type GetCurrencies = ReturnType<typeof getCurrencies>;
export type SetCurrencies = ReturnType<typeof setCurrencies>;
