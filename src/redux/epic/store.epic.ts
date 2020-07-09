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
  putWebRequest,
  deleteWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.store.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { storeActions } from '../slices/store/store.slice';

export const apiGetAllStoresEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(storeActions.apiGetAllStores.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_ALL_STORES, state$.value).pipe(
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
                { type: 'ERROR_GET_ALL_STORES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting stores. ${errorResponse}`,
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

export const apiCreateStoreEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(storeActions.apiCreateStore.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return postWebRequest(
        api.CREATE_NEW_STORE,
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
                { type: 'ERROR_CREATE_STORE' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while creating store. ${errorResponse}`,
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

export const apiUpdateStoreEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(storeActions.apiUpdateStore.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return putWebRequest(
        api.UPDATE_NEW_STORE,
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
                { type: 'ERROR_UPDATE_STORE' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while updating store. ${errorResponse}`,
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

export const apiDeleteStoreByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(storeActions.apiDeleteStoreById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return deleteWebRequest(
        api.DELETE_STORE_BY_ID,
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
                { type: 'ERROR_DELETE_STORE' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while deleting store. ${errorResponse}`,
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
