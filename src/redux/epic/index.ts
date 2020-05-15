import { combineEpics } from 'redux-observable';
import * as authEpic from './auth.api';
import * as dealerEpic from './dealer.epic';
import * as unitsEpic from './units.epic';

const arrayEpic = [
  ...Object.values(authEpic),
  ...Object.values(dealerEpic),
  ...Object.values(unitsEpic),
];

export const rootEpic = combineEpics(...arrayEpic);

export default rootEpic;
