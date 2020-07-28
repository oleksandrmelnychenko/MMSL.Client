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
  postFormDataWebRequest,
  getWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.fabric.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { fabricImporterActions } from '../slices/store/fabric/fabricImporter.slice';
import { getApplied } from '../../interfaces/fabric';

export const apiImportFabricsFromExcelEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fabricImporterActions.apiImportFabricsFromExcel.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const formData: FormData = new FormData();
      formData.append('File', action.payload);

      return postFormDataWebRequest(
        api.IMPORT_FABRICS_FROM_EXCEL,
        formData,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              fabricImporterActions.changeIsImporting(false),
              controlActions.showInfoMessage(
                new InfoMessage(`Successfully imported`, InfoMessageType.Common)
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
                fabricImporterActions.changeIsImporting(false),
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

export const apiExportToPDFPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fabricImporterActions.apiExportToPDFPaginated.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const searchPhrase = state$.value.fabric.searchWord;
      const filters = getApplied(state$.value.fabricFilters.filters);

      return getWebRequest(api.EXPORT_FABRICS_TO_PDF, state$.value, [
        {
          key: 'searchPhrase',
          value: `${searchPhrase}`,
        },
        {
          key: 'filterBuilder',
          value: `${JSON.stringify(filters)}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              fabricImporterActions.changeIsExporting(false),
              controlActions.showInfoMessage(
                new InfoMessage(`Successfully exported`, InfoMessageType.Common)
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
                fabricImporterActions.changeIsExporting(false),
                { type: 'ERROR_EXPORT_FABRICS_TO_PDF' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while export fabrics to PDF. ${errorResponse}`,
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
