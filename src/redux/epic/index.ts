import { combineEpics } from 'redux-observable';
import * as authEpic from './auth.api';
import * as dealerEpic from './dealer.epic';

const arrayEpic = [...Object.values(authEpic), ...Object.values(dealerEpic)];

export const rootEpic = combineEpics(...arrayEpic);

export default rootEpic;
