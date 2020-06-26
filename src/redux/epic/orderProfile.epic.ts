import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import { getWebRequest, postWebRequest } from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { orderProfileActions } from '../slices/orderProfile/orderProfile.slice';

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
