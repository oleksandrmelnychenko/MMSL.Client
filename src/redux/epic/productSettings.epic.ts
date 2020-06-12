import {
  ajaxPutResponse,
  ajaxPutFormDataResponse,
  ajaxPostFormDataResponse,
  ajaxDeleteResponse,
} from './../../helpers/epic.helper';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError, debounceTime } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxPostResponse,
  ajaxGetWebResponse,
} from '../../helpers/epic.helper';
import StoreHelper from '../../helpers/store.helper';
import * as api from '../constants/api.constants';
import { controlActions } from '../slices/control.slice';
import { productSettingsActions } from '../slices/productSettings.slice';

const FORM_DATA_IMAGE_FILE_KEY = 'file';

export const apiUpdateOptionGroupEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiUpdateOptionGroup.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxPutResponse(
        api.UPDATE_OPTION_GROUP,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                'Option group updated successfully'
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while updating option group. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiCreateOptionGroupEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiCreateOptionGroup.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPostResponse(
        api.CREATE_NEW_OPTION_GROUP,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage('New style created successfully'),
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
                controlActions.showInfoMessage(
                  `Error occurred while creating new style. ${errorResponse}`
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

export const apiGetAllOptionGroupsByProductIdListEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiGetAllOptionGroupsByProductIdList.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxGetWebResponse(api.GET_ALL_OPTION_GROUPS, state$.value, [
        {
          key: 'productCategoryId',
          value: `${action.payload}`,
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while getting option groups list. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiSearchOptionGroupsByProductIdListEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiSearchOptionGroupsByProductIdList.type),
    debounceTime(500),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_ALL_OPTION_GROUPS, state$.value, [
        {
          key: 'search',
          value: `${state$.value.productSettings.searchWordOptionGroup}`,
        },
        {
          key: 'productCategoryId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              productSettingsActions.updateOptionGroupList(successResponse),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while searching option groups. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiModifyOptionUnitsOrderEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiModifyOptionUnitsOrder.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPutResponse(
        api.MODIFY_OPTION_UNITS_ORDER,
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while updating option units order. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiUpdateOptionUnitEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiUpdateOptionUnit.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const formData: FormData = new FormData();
      formData.append(FORM_DATA_IMAGE_FILE_KEY, action.payload.imageBlob);

      return ajaxPutFormDataResponse(
        api.MODIFY_OPTION_UNIT,
        formData,
        state$.value,
        [
          {
            key: 'orderIndex',
            value: `${action.payload.orderIndex}`,
          },
          {
            key: 'value',
            value: `${action.payload.value}`,
          },
          {
            key: 'isMandatory',
            value: `${action.payload.isMandatory}`,
          },
          {
            key: 'ImageUrl',
            value: `${encodeURIComponent(action.payload.imageUrl)}`,
          },
          {
            key: 'id',
            value: `${action.payload.id}`,
          },
        ]
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(successResponse.message),
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while updating option unit. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiCreateNewOptionUnitEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiCreateNewOptionUnit.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const formData: FormData = new FormData();
      formData.append(FORM_DATA_IMAGE_FILE_KEY, action.payload.imageBlob);

      return ajaxPostFormDataResponse(
        api.ADD_OPTION_UNIT,
        formData,
        state$.value,
        [
          {
            key: 'orderIndex',
            value: `${action.payload.orderIndex}`,
          },
          {
            key: 'value',
            value: `${action.payload.value}`,
          },
          {
            key: 'isMandatory',
            value: `${action.payload.isMandatory}`,
          },
          {
            key: 'imageUrl',
            value: `${encodeURIComponent(action.payload.imageUrl)}`,
          },
          {
            key: 'id',
            value: `${action.payload.id}`,
          },
          {
            key: 'optionGroupId',
            value: `${action.payload.optionGroupId}`,
          },
        ]
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(successResponse.message),
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while creating new option unit. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiDeleteOptionUnitByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiDeleteOptionUnitById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxDeleteResponse(api.DELETE_OPTION_UNIT_BY_ID, state$.value, [
        { key: 'optionUnitId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(successResponse.message),
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while deleteing option unit. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiGetOptionGroupByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiGetOptionGroupById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_OPTION_GROUP_BY_ID, state$.value, [
        { key: 'groupId', value: `${action.payload}` },
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while getting option group. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiGetOptionUnitByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiGetOptionUnitById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return ajaxGetWebResponse(api.GET_OPTION_UNIT_BY_ID, state$.value, [
        { key: 'optionUnitId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [controlActions.showInfoMessage(successResponse.message)],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                controlActions.showInfoMessage(
                  `Error occurred while getting option unit for select. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};

export const apiDeleteOptionGroupByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiDeleteOptionGroupById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxDeleteResponse(api.DELETE_OPTION_GROUP_BY_ID, state$.value, [
        { key: 'optionGroupId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(successResponse.message),
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while deleteing option group. ${errorResponse}`
                ),
              ],
              action
            );
          });
        })
      );
    })
  );
};
