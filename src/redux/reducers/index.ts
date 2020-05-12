import { combineReducers } from '@reduxjs/toolkit';
import { localizeReducer, LocalizeState } from 'react-localize-redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { IAuthState } from '../../interfaces';
import { authReducer } from './auth.reducer';
import { DealerState, dealerReducer } from './dealer.reducer';

export interface IApplicationState {
  auth: IAuthState;
  routing: RouterState;
  localize: LocalizeState;
  dealer: DealerState;
}

export const reducer = combineReducers({
  auth: authReducer,
  routing: routerReducer,
  localize: localizeReducer,
  dealer: dealerReducer,
});
