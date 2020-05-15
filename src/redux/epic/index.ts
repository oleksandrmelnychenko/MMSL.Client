import { combineEpics } from 'redux-observable';
import * as authEpic from './auth.api';
import * as dealerEpic from './dealer.epic';
import * as unitsEpic from './units.epic';
import * as customerEpic from './customer.epic';

const arrayEpic = [
  ...Object.values(authEpic),
  ...Object.values(dealerEpic),
  ...Object.values(unitsEpic),
  ...Object.values(customerEpic),
];

export const rootEpic = combineEpics(...arrayEpic);

export default rootEpic;
