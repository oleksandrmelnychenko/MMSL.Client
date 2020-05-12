import { switchMap } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { of } from 'rxjs';
import * as dealerTypes from '../../constants/dealer.types.constants';

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
