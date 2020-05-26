import { combineReducers } from '@reduxjs/toolkit';
import { localizeReducer, LocalizeState } from 'react-localize-redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { IAuthState, IControlState } from '../../interfaces';
import { default as controlReducer } from '../slices/control.slice';
import {
  default as productSettingsReducer,
  ProductSettingsState,
} from '../slices/productSettings.slice';
import { default as authReducer } from '../slices/auth.slice';
import { default as unitsReducer, UnitsState } from '../slices/units.slice';
import { default as dealerReducer, DealerState } from '../slices/dealer.slice';
import {
  default as productReducer,
  ProductState,
} from '../slices/product.slice';
import {
  default as customerReducer,
  CustomerState,
} from '../slices/customer.slice';

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
