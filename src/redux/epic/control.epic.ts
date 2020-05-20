import { debounceTime } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';

import { mapTo } from 'rxjs/operators';
import * as controlTypes from '../constants/control.types.constants';

export const closeInfoMessageEpic = (action$: AnyAction) => {
  return action$.pipe(
    ofType(controlTypes.SHOW_INFO_MESSAGE),
    debounceTime(2500),
    mapTo({ type: 'control.CLEAR_INFO_MESSAGE' })
  );
};
