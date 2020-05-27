import { debounceTime } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';

import { mapTo } from 'rxjs/operators';
import { controlActions } from '../slices/control.slice';

export const closeInfoMessageEpic = (action$: AnyAction) => {
  return action$.pipe(
    ofType(controlActions.showInfoMessage.type),
    debounceTime(2500),
    mapTo(controlActions.clearInfoMessage())
  );
};
