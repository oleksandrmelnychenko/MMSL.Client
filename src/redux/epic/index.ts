import { combineEpics } from 'redux-observable';
import * as authEpic from './auth.api';

const arrayEpic = [...Object.values(authEpic)];

export const rootEpic = combineEpics(...arrayEpic);

export default rootEpic;
