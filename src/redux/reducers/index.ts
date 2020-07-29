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
} from '../slices/customer/customer.slice';
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
} from '../slices/customer/orderProfile/orderProfile.slice';
import {
  default as profileManagingReducer,
  IProfileManagingState,
} from '../slices/customer/orderProfile/profileManaging.slice';
import {
  default as storeReducer,
  IStoreState,
} from '../slices/store/store.slice';
import {
  default as fabricReducer,
  IFabricState,
} from '../slices/store/fabric/fabric.slice';
import {
  default as rightPanelReducer,
  IRightPanelState,
} from '../slices/rightPanel.slice';
import {
  default as fabricFiltersReducer,
  IfabricFiltersState,
} from '../slices/store/fabric/fabricFilters.slice';
import {
  default as fabricImporterReducer,
  IFabricImportertate,
} from '../slices/store/fabric/fabricImporter.slice';
import {
  default as infoPanelReducer,
  IInfoPanelState,
} from '../slices/infoPanel.slice';

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
  profileManaging: IProfileManagingState;
  store: IStoreState;
  fabric: IFabricState;
  rightPanel: IRightPanelState;
  fabricFilters: IfabricFiltersState;
  fabricImporter: IFabricImportertate;
  infoPanel: IInfoPanelState;
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
  profileManaging: profileManagingReducer,
  store: storeReducer,
  fabric: fabricReducer,
  rightPanel: rightPanelReducer,
  fabricFilters: fabricFiltersReducer,
  fabricImporter: fabricImporterReducer,
  infoPanel: infoPanelReducer,
});
