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
import { controlActions } from '../slices/control.slice';
import { measurementActions } from '../../redux/slices/measurements/measurement.slice';
import StoreHelper from '../../helpers/store.helper';

export const apiGetAllMeasurementsEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(measurementActions.apiGetAllMeasurements.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_ALL_MEASUREMENTS, state$.value).pipe(
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
                { type: 'ERROR_GET_ALL_MEASUREMENTS' },
                controlActions.showInfoMessage(
                  `Error occurred while getting measurements list. ${errorResponse}`
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

export const apiCreateNewMeasurementEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(measurementActions.apiCreateNewMeasurement.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return postWebRequest(
        api.ADD_NEW_MEASUREMENT,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                `New measurement successfully created.`
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
                { type: 'ERROR_CREATE_NEW_MEASUREMENT' },
                controlActions.showInfoMessage(
                  `Error occurred while creating new measurement. ${errorResponse}`
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

export const apiGetMeasurementByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(measurementActions.apiGetMeasurementById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_MEASUREMENT_BY_ID, state$.value, [
        { key: 'measurementId', value: `${action.payload}` },
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
                { type: 'ERROR_GET_MEASUREMENT_BY_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while getting measurement by id. ${errorResponse}`
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

export const apiDeleteMeasurementByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(measurementActions.apiDeleteMeasurementById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return deleteWebRequest(api.DELETE_MEASUREMENT, state$.value, [
        {
          key: 'measurementId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                `Measurement successfully deleted.`
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
                { type: 'ERROR_DELETE_MEASUREMENT' },
                controlActions.showInfoMessage(
                  `Error occurred while deleting measurement. ${errorResponse}`
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

export const apiUpdateMeasurementEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(measurementActions.apiUpdateMeasurement.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return putWebRequest(
        api.UPDATE_MEASUREMENT,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                `Measurement successfully updated.`
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
                { type: 'ERROR_UPDATE_MEASUREMENT' },
                controlActions.showInfoMessage(
                  `Error occurred while updating measurement. ${errorResponse}`
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

export const apiCreateNewMeasurementSizeEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(measurementActions.apiCreateNewMeasurementSize.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return postWebRequest(
        api.CREATE_MEASUREMENT_SIZE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(`New size successfully created.`),
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
                { type: 'ERROR_CREATE_NEW_MEASUREMENT_SIZE' },
                controlActions.showInfoMessage(
                  `Error occurred while creating new measurement size. ${errorResponse}`
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

export const apiUpdateMeasurementSizeEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(measurementActions.apiUpdateMeasurementSize.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return putWebRequest(
        api.UPDATE_MEASUREMENT_SIZE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(`Size successfully updated.`),
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
                { type: 'ERROR_UPDATE_SIZE' },
                controlActions.showInfoMessage(
                  `Error occurred while updating size. ${errorResponse}`
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

export const apiDeleteMeasurementSizeByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(measurementActions.apiDeleteMeasurementSizeById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return deleteWebRequest(api.DELETE_MEASUREMENT_SIZE, state$.value, [
        {
          key: 'measurementId',
          value: `${action.payload.measurementId}`,
        },
        {
          key: 'sizeId',
          value: `${action.payload.sizeId}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(`Size successfully deleted.`),
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
                { type: 'ERROR_DELETE_SIZE' },
                controlActions.showInfoMessage(
                  `Error occurred while deleting size. ${errorResponse}`
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
