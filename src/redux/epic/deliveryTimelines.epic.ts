import { putWebRequest, deleteWebRequest } from './../../helpers/epic.helper';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import { postWebRequest, getWebRequest } from '../../helpers/epic.helper';
import StoreHelper from '../../helpers/store.helper';
import * as api from '../constants/api.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
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

      return getWebRequest(api.GET_ALL_DELIVERY_TIMELINES, state$.value).pipe(
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
                  new InfoMessage(
                    `Error occurred while getting delivery timelines. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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

      return postWebRequest(
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
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while creating new delivery timeline. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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

      return putWebRequest(
        api.UPDATE_DELIVERY_TIMELINE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              deliveryTimelinesActions.apiGetAllDeliveryTimeline(),
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while updating delivery timeline. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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

      return deleteWebRequest(
        api.DELETE_DELIVERY_TIMELINE_BY_ID,
        state$.value,
        [{ key: 'deliveryTimelineId', value: `${action.payload}` }]
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              deliveryTimelinesActions.apiGetAllDeliveryTimeline(),
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while deleting delivery timeline. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
