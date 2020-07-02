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
  getWebRequest,
  postWebRequest,
  deleteWebRequest,
  putWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { orderProfileActions } from '../slices/customer/orderProfile/orderProfile.slice';

export const apiGetOrderProfilesEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(orderProfileActions.apiGetOrderProfiles.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_ALL_ORDER_PROFILES, state$.value, []).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [controlActions.disabledStatusBar()],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_GET_ORDER_PROFILES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting order profiles. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiCreateOrderProfileEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(orderProfileActions.apiCreateOrderProfile.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return postWebRequest(
        api.CREATE_ORDER_PROFILE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(`New style permission successfully created.`)
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
                { type: 'ERROR_CREATE_NEW_PRODUCT_STYLE_PERMISSION' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while creating new product style permission. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiDeleteOrderProfileByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(orderProfileActions.apiDeleteOrderProfileById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return deleteWebRequest(api.DELETE_ORDER_PROFILE, state$.value, [
        {
          key: 'customerProductProfileId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(`Order profile successfully deleted.`)
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
                { type: 'ERROR_DELETE_ORDER_PROFILE' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while deleting order profile permission. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiGetOrderProfileByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(orderProfileActions.apiGetOrderProfileById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_ORDER_PROFILE_BY_ID, state$.value, [
        {
          key: 'profileId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [controlActions.disabledStatusBar()],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_GET_ORDER_PROFILE_BY_ID' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting order profile. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiUpdateOrderProfileEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(orderProfileActions.apiUpdateOrderProfile.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return putWebRequest(
        api.UPDATE_ORDER_PROFILE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [controlActions.disabledStatusBar()],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_UPDATE_ORDER_PROFILE' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while updating order profile. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
                ),
                controlActions.disabledStatusBar(),
              ],
              action
            );
          });
        })
      );
    })
  );
};
