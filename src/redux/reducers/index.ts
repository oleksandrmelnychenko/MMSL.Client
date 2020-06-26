import {
  default as deliveryTimelinesReducer,
  DeliveryTimelinesState,
} from './../slices/deliveryTimeline.slice';
import {
  default as productStylePermissionsReducer,
  ProductStylePermissionsState,
} from './../slices/productStylePermissions.slice';
import { combineReducers } from '@reduxjs/toolkit';
import { localizeReducer, LocalizeState } from 'react-localize-redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { IAuthState } from '../../interfaces/identity';
import {
  default as controlReducer,
  ControlState,
} from '../slices/control.slice';
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
import {
  default as measurementsStateReducer,
  MeasurementsState,
} from '../slices/measurements/measurement.slice';
import {
  default as measurementViewControlsReducer,
  IMeasurementViewControlsState,
} from '../slices/measurements/measurementViewControls.slice';
import {
  default as fittingTypesReducer,
  IFittingTypesState,
} from '../slices/measurements/fittingTypes.slice';
import {
  default as unitsOfMeasurementReducer,
  IUnitsOfMeasurementState,
} from '../slices/measurements/unitsOfMeasurement.slice';
import {
  default as dealerProductsReducer,
  IDealerProductsState,
} from '../slices/dealer/dealerProducts.slice';
import {
  default as orderProfileReducer,
  IOrderProfileState,
} from '../slices/orderProfile/orderProfile.slice';

export interface IApplicationState {
  auth: IAuthState;
  control: ControlState;
  routing: RouterState;
  localize: LocalizeState;
  dealer: DealerState;
  units: UnitsState;
  customer: CustomerState;
  product: ProductState;
  productSettings: ProductSettingsState;
  measurements: MeasurementsState;
  productStylePermissions: ProductStylePermissionsState;
  deliveryTimelines: DeliveryTimelinesState;
  measurementViewControls: IMeasurementViewControlsState;
  fittingTypes: IFittingTypesState;
  unitsOfMeasurement: IUnitsOfMeasurementState;
  dealerProducts: IDealerProductsState;
  orderProfile: IOrderProfileState;
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
  measurements: measurementsStateReducer,
  productStylePermissions: productStylePermissionsReducer,
  deliveryTimelines: deliveryTimelinesReducer,
  measurementViewControls: measurementViewControlsReducer,
  fittingTypes: fittingTypesReducer,
  unitsOfMeasurement: unitsOfMeasurementReducer,
  dealerProducts: dealerProductsReducer,
  orderProfile: orderProfileReducer,
});
