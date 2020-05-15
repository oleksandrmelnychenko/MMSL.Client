import { UnitsState, unitsReducer } from './units.reducer';
import { combineReducers } from '@reduxjs/toolkit';
import { localizeReducer, LocalizeState } from 'react-localize-redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { IAuthState, IControlState } from '../../interfaces';
import { authReducer } from './auth.reducer';
import { DealerState, dealerReducer } from './dealer.reducer';
import { controlReducer } from './control.reducer';

export interface IApplicationState {
  auth: IAuthState;
  control: IControlState;
  routing: RouterState;
  localize: LocalizeState;
  dealer: DealerState;
  units: UnitsState;
}

export const reducer = combineReducers({
  auth: authReducer,
  control: controlReducer,
  routing: routerReducer,
  localize: localizeReducer,
  dealer: dealerReducer,
  units: unitsReducer,
});
