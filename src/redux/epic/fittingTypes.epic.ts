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
import StoreHelper from '../../helpers/store.helper';
import { fittingTypesActions } from '../slices/measurements/fittingTypes.slice';

export const apiGetAllMeasurementsEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fittingTypesActions.apiGetFittingTypesByMeasurementId.type),
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
