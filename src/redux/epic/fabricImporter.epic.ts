import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import { postFormDataWebRequest } from '../../helpers/epic.helper';
import * as api from '../constants/api.fabric.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { fabricImporterActions } from '../slices/store/fabric/fabricImporter.slice';

export const apiImportFabricsFromExcelEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fabricImporterActions.apiImportFabricsFromExcel.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const formData: FormData = new FormData();
      //   formData.append(FABRIC_CODE, action.payload.fabricCode);
      //   formData.append(DESCRIPTION, action.payload.description);
      //   formData.append(STATUS, action.payload.status);
      //   formData.append(COMPOSITION, action.payload.composition);
      //   formData.append(PATTERN, action.payload.pattern);
      //   formData.append(METRES, action.payload.metres);
      //   formData.append(WEAVE, action.payload.weave);
      //   formData.append(COLOR, action.payload.color);
      //   formData.append(MILL, action.payload.mill);
      //   formData.append(GSM, action.payload.gSM);
      //   formData.append(COUNT, action.payload.count);
      //   formData.append(FILE, action.payload.imageFile);

      return postFormDataWebRequest(
        api.IMPORT_FABRICS_FROM_EXCEL,
        formData,
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
                { type: 'ERROR_IMPORT_FABRICS_FROM_EXCEL' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while importing fabrics from excel. ${errorResponse}`,
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
