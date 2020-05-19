import { CurrencyF, PaymentTypeF } from '../../interfaces/index';
import { createAction } from '@reduxjs/toolkit';
import * as unitsTypes from '../constants/units.types.constants';

export const getCurrencies = createAction(unitsTypes.GET_CURRENCIES);
export const setCurrencies = createAction<CurrencyF[]>(
  unitsTypes.SET_CURRENCIES
);

export const getPaymentTypes = createAction(unitsTypes.GET_PAYMENT_TYPES);
export const setPaymentTypes = createAction<PaymentTypeF[]>(
  unitsTypes.SET_PAYMENT_TYPES
);

export type GetCurrencies = ReturnType<typeof getCurrencies>;
export type SetCurrencies = ReturnType<typeof setCurrencies>;
export type GetPaymentTypes = ReturnType<typeof getPaymentTypes>;
export type SetPaymentTypes = ReturnType<typeof setPaymentTypes>;
