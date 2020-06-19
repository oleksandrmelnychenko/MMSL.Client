import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import { getWebRequest } from '../../helpers/epic.helper';
import * as api from '../constants/api.unitOfMeasurements.constants';
import { controlActions } from '../slices/control.slice';
import { unitsOfMeasurementActions } from '../slices/measurements/unitsOfMeasurement.slice';

export const apiGetAllUnitsOfMeasurementEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(unitsOfMeasurementActions.apiGetAllUnitsOfMeasurement.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_ALL_UNITS_OF_MEASUREMENT, state$.value).pipe(
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
                { type: 'ERROR_GET_ALL_UNITS_OF_MEASUREMENT' },
                controlActions.showInfoMessage(
                  `Error occurred while getting units of measurement. ${errorResponse}`
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
