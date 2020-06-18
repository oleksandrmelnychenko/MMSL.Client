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
import * as api from '../constants/api.fittingType.constants';
import { controlActions } from '../slices/control.slice';
import { fittingTypesActions } from '../slices/measurements/fittingTypes.slice';

export const apiGetFittingTypesByMeasurementIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fittingTypesActions.apiGetFittingTypesByMeasurementId.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(
        api.GET_ALL_FITTING_TYPES_BY_MEASUREMENT_ID,
        state$.value,
        [{ key: 'measurementId', value: `${action.payload}` }]
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
                { type: 'ERROR_GET_FITTING_TYPES_BY_MEASUREMENT_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while getting measurement fitting types. ${errorResponse}`
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

export const apiGetFittingTypeByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fittingTypesActions.apiGetFittingTypeById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_FITTING_TYPE_BY_ID, state$.value, [
        { key: 'fittingTypeId', value: `${action.payload}` },
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
                { type: 'ERROR_GET_FITTING_TYPE_BY_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while getting fitting type. ${errorResponse}`
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

export const apiCreateFittingTypeEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fittingTypesActions.apiCreateFittingType.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return postWebRequest(
        api.CREATE_FITTING_TYPE,
        action.payload,
        state$.value,
        true
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
                { type: 'ERROR_CREATE_FITTING_TYPE' },
                controlActions.showInfoMessage(
                  `Error occurred while creating fitting type. ${errorResponse}`
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

export const apiUpdateFittingTypeEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fittingTypesActions.apiUpdateFittingType.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return putWebRequest(
        api.UPDATE_FITTING_TYPE,
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
                { type: 'ERROR_UPDATE_FITTING_TYPE' },
                controlActions.showInfoMessage(
                  `Error occurred while updating fitting type. ${errorResponse}`
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

export const apiDeleteFittingTypeByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fittingTypesActions.apiDeleteFittingTypeById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return deleteWebRequest(api.DELETE_FITTING_TYPE, state$.value, [
        { key: 'fittingTypeId', value: `${action.payload}` },
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
                { type: 'ERROR_DELETE_FITTING_TYPE_BY_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while deleting fitting type. ${errorResponse}`
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
