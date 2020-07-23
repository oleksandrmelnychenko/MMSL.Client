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
  postFormDataWebRequest,
  putFormDataWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.fabric.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { fabricActions } from '../slices/store/fabric/fabric.slice';
import { List } from 'linq-typescript';
import {
  FilterItem,
  FabricFilterValue,
  getApplied,
} from '../../interfaces/fabric';

const FABRIC_CODE: string = 'fabricCode';
const DESCRIPTION: string = 'description';
const STATUS: string = 'status';
const COMPOSITION: string = 'composition';
const PATTERN: string = 'pattern';
const METRES: string = 'metres';
const WEAVE: string = 'weave';
const COLOR: string = 'color';
const MILL: string = 'mill';
const GSM: string = 'gsm';
const COUNT: string = 'count';
const FILE: string = 'file';
const ID: string = 'id';
const IMAGE_URL: string = 'ImageUrl';

export const apiGetAllFabricsEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fabricActions.apiGetAllFabrics.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_ALL_FABRICS, state$.value).pipe(
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
                { type: 'ERROR_GET_ALL_FABRICS' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting fabrics. ${errorResponse}`,
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

export const apiGetAllFabricsPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fabricActions.apiGetAllFabricsPaginated.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const pageNumber =
        state$.value.fabric.pagination.paginationInfo.pageNumber;
      const limit = state$.value.fabric.pagination.limit;
      const searchPhrase = state$.value.fabric.searchWord;

      const filters = getApplied(state$.value.fabricFilters.filters);

      return getWebRequest(api.GET_ALL_FABRICS, state$.value, [
        {
          key: 'pageNumber',
          value: `${pageNumber}`,
        },
        {
          key: 'limit',
          value: `${limit}`,
        },
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
            [controlActions.disabledStatusBar()],

            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_GET_ALL_FABRICS' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting fabrics. ${errorResponse}`,
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

export const apiCreateFabricEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fabricActions.apiCreateFabric.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const formData: FormData = new FormData();
      formData.append(FABRIC_CODE, action.payload.fabricCode);
      formData.append(DESCRIPTION, action.payload.description);
      formData.append(STATUS, action.payload.status);
      formData.append(COMPOSITION, action.payload.composition);
      formData.append(PATTERN, action.payload.pattern);
      formData.append(METRES, action.payload.metres);
      formData.append(WEAVE, action.payload.weave);
      formData.append(COLOR, action.payload.color);
      formData.append(MILL, action.payload.mill);
      formData.append(GSM, action.payload.gSM);
      formData.append(COUNT, action.payload.count);
      formData.append(FILE, action.payload.imageFile);

      return postFormDataWebRequest(
        api.CREATE_NEW_FABRIC,
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
                { type: 'ERROR_CREATE_FABRIC' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while creating fabric. ${errorResponse}`,
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

export const apiUpdateFabricEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fabricActions.apiUpdateFabric.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const formData: FormData = new FormData();
      formData.append(FABRIC_CODE, action.payload.fabricCode);
      formData.append(DESCRIPTION, action.payload.description);
      formData.append(STATUS, action.payload.status);
      formData.append(COMPOSITION, action.payload.composition);
      formData.append(PATTERN, action.payload.pattern);
      formData.append(METRES, action.payload.metres);
      formData.append(WEAVE, action.payload.weave);
      formData.append(COLOR, action.payload.color);
      formData.append(MILL, action.payload.mill);
      formData.append(GSM, action.payload.gSM);
      formData.append(COUNT, action.payload.count);
      formData.append(FILE, action.payload.imageFile);
      formData.append(ID, action.payload.id);
      formData.append(IMAGE_URL, action.payload.imageUrl);

      return putFormDataWebRequest(
        api.UPDATE_FABRIC,
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
                { type: 'ERROR_UPDATE_FABRIC' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while updating fabric. ${errorResponse}`,
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

export const apiUpdateFabricVisibilityEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(fabricActions.apiUpdateFabricVisibility.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return putWebRequest(
        api.UPDATE_FABRIC_VISIBILITY,
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
                { type: 'ERROR_UPDATE_FABRIC_VISIBILITIES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while updating fabric visibilities. ${errorResponse}`,
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

export const apiGetFabricVisibilityEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fabricActions.apiGetFabricVisibility.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_FABRIC_VISIBILITY, state$.value).pipe(
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
                { type: 'ERROR_GET_FABRIC_VISIBILITIES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting fabric visibilities. ${errorResponse}`,
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

export const apiDeleteFabricByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(fabricActions.apiDeleteFabricById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return deleteWebRequest(api.DELETE_FABRIC_BY_ID, state$.value, [
        {
          key: 'fabricId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(`Fabric successfully deleted.`)
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
                { type: 'ERROR_DELETE_FABRIC' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while deleting fabric. ${errorResponse}`,
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
