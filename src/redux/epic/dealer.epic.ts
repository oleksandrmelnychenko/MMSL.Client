import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractSuccessPendingActions,
  extractErrorPendingActions,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { of } from 'rxjs';
import * as dealerTypes from '../../constants/dealer.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import { ajaxPostResponse } from '../../helpers/epic.helper';
import * as api from '../../constants/api.constants';

export const getDroneListEpic = (action$: AnyAction, state$: any) =>
  action$.pipe(
    ofType(dealerTypes.GET_DEALERS_LIST),
    switchMap((action: AnyAction) => {
      /// TODO: temporary hardcoded, use api
      const items: any[] = [];
      for (let i = 0; i < 3; i++) {
        items.push({
          dealerInfo: `dealer info ${i}`,
          rejected: `rejected ${i}`,
          processing: `Processing ${i}`,
          stitching: `Stitching ${i}`,
          stitched: `Stitched ${i}`,
          dispatched: `Dispatched ${i}`,
          delivered: `Delivered ${i}`,
        });
      }

      return of(dealerActions.updateDealersList(items));
    })
  );

export const saveNewDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerTypes.SAVE_NEW_DEALER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      debugger;
      return ajaxPostResponse(
        api.CREATE_NEW_DEALER,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [...extractSuccessPendingActions(action)];

          return of(...successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [...extractErrorPendingActions(action)];

            return of(errorResultFlow);
          });
        })
      );
    })
  );
};
