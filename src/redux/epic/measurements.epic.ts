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
  ajaxGetWebResponse,
  ajaxPostResponse,
  ajaxDeleteResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import { controlActions } from '../slices/control.slice';
import { measurementActions } from '../../redux/slices/measurement.slice';
import StoreHelper from '../../helpers/store.helper';

export const apiGetAllMeasurementsEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(measurementActions.apiGetAllMeasurements.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_ALL_MEASUREMENTS, state$.value).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              measurementActions.updateisMeasurementsWasRequested(true),
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
                { type: 'ERROR_GET_MEASUREMENTS_BY_PRODUCT' },
                measurementActions.updateisMeasurementsWasRequested(true),
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

      return ajaxPostResponse(
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

export const apiDeleteMeasurementByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(measurementActions.apiDeleteMeasurementById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      debugger;
      return ajaxDeleteResponse(api.DELETE_MEASUREMENT, state$.value, [
        {
          key: 'measurementId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          debugger;

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
          debugger;
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
