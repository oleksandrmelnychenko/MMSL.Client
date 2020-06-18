import { combineEpics } from 'redux-observable';
import * as authEpic from './auth.api';
import * as dealerEpic from './dealer.epic';
import * as unitsEpic from './units.epic';
import * as controlEpic from './control.epic';
import * as customerEpic from './customer.epic';
import * as productSettings from './productSettings.epic';
import * as productCategory from './productCategory.epic';
import * as measurements from './measurements.epic';
import * as productStylePermissions from './productStylePermissions.epic';
import * as fittingTypes from './fittingTypes.epic';

const arrayEpic = [
  ...Object.values(authEpic),
  ...Object.values(dealerEpic),
  ...Object.values(unitsEpic),
  ...Object.values(customerEpic),
  ...Object.values(controlEpic),
  ...Object.values(productSettings),
  ...Object.values(productCategory),
  ...Object.values(measurements),
  ...Object.values(productStylePermissions),
  ...Object.values(fittingTypes),
];

export const rootEpic = combineEpics(...arrayEpic);

export default rootEpic;
