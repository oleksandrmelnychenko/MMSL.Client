import {
  ajaxPutResponse,
  ajaxDeleteResponse,
} from './../../helpers/epic.helper';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxPostResponse,
  ajaxGetWebResponse,
} from '../../helpers/epic.helper';
import StoreHelper from '../../helpers/store.helper';
import * as api from '../constants/api.constants';
import { controlActions } from '../slices/control.slice';
import { deliveryTimelinesActions } from '../slices/deliveryTimeline.slice';

export const apiGetAllDeliveryTimelineEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(deliveryTimelinesActions.apiGetAllDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxGetWebResponse(
        api.GET_ALL_DELIVERY_TIMELINES,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              deliveryTimelinesActions.successGetAllDeliveryTimelines(
                successResponse
              ),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while getting delivery timelines. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiCreateNewDeliveryTimelineEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(deliveryTimelinesActions.apiCreateNewDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxPostResponse(
        api.ADD_DELIVERY_TIMELINE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              deliveryTimelinesActions.apiGetAllDeliveryTimeline(),
              controlActions.showInfoMessage(successResponse.message),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while creating new delivery timeline. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiUpdateDeliveryTimelineEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(deliveryTimelinesActions.apiUpdateDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxPutResponse(
        api.UPDATE_DELIVERY_TIMELINE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              deliveryTimelinesActions.apiGetAllDeliveryTimeline(),
              controlActions.showInfoMessage(successResponse.message),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while updating delivery timeline. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiDeleteDeliveryTimelineEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(deliveryTimelinesActions.apiDeleteDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxDeleteResponse(
        api.DELETE_DELIVERY_TIMELINE_BY_ID,
        state$.value,
        [{ key: 'deliveryTimelineId', value: `${action.payload}` }]
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              deliveryTimelinesActions.apiGetAllDeliveryTimeline(),
              controlActions.showInfoMessage(successResponse.message),
              controlActions.disabledStatusBar(),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while deleting delivery timeline. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};
