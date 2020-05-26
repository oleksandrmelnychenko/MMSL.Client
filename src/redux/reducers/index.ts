import {
  ProductSettingsState,
  productSettingsReducer,
} from './productSettings.reducer';
import { CustomerState, customerReducer } from './customer.reducer';
import { UnitsState, unitsReducer } from './units.reducer';
import { combineReducers } from '@reduxjs/toolkit';
import { localizeReducer, LocalizeState } from 'react-localize-redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { IAuthState, IControlState } from '../../interfaces';
import { DealerState, dealerReducer } from './dealer.reducer';
import { default as controlReducer } from '../slices/control.slice';
import { default as authReducer } from '../slices/auth.slice';
import { default as productReducer } from '../slices/product.slice';
import { ProductState } from '../slices/product.slice';

export interface IApplicationState {
  auth: IAuthState;
  control: IControlState;
  routing: RouterState;
  localize: LocalizeState;
  dealer: DealerState;
  units: UnitsState;
  customer: CustomerState;
  product: ProductState;
  productSettings: ProductSettingsState;
}

export const reducer = combineReducers({
  auth: authReducer,
  control: controlReducer,
  routing: routerReducer,
  localize: localizeReducer,
  dealer: dealerReducer,
  units: unitsReducer,
  customer: customerReducer,
  product: productReducer,
  productSettings: productSettingsReducer,
});
