import {
  putWebRequest,
  putFormDataWebRequest,
  postFormDataWebRequest,
  deleteWebRequest,
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
import { postWebRequest, getWebRequest } from '../../helpers/epic.helper';
import StoreHelper from '../../helpers/store.helper';
import * as api from '../constants/api.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { productSettingsActions } from '../slices/productSettings.slice';

const FORM_DATA_IMAGE_FILE_KEY = 'file';

export const apiUpdateOptionGroupEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiUpdateOptionGroup.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return putWebRequest(
        api.UPDATE_OPTION_GROUP,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage('Style updated successfully')
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
                  new InfoMessage(
                    `Error occurred while updating style. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
      return postWebRequest(
        api.CREATE_NEW_OPTION_GROUP,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage('New style created successfully')
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
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while creating new style. ${errorResponse}`,
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

export const apiGetAllOptionGroupsByProductIdListEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiGetAllOptionGroupsByProductIdList.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return getWebRequest(api.GET_ALL_OPTION_GROUPS, state$.value, [
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
                  new InfoMessage(
                    `Error occurred while getting style list. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
      return getWebRequest(api.GET_ALL_OPTION_GROUPS, state$.value, [
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
                  new InfoMessage(
                    `Error occurred while searching styles. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
      return putWebRequest(
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
                  new InfoMessage(
                    `Error occurred while updating style options order. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
      formData.append('orderIndex', action.payload.orderIndex);
      formData.append('value', action.payload.value);
      formData.append('isMandatory', action.payload.isMandatory);
      formData.append('isBodyPosture', action.payload.isBodyPosture);
      formData.append('ImageUrl', action.payload.imageUrl);
      formData.append('id', action.payload.id);
      formData.append(
        'serializedValues',
        JSON.stringify(action.payload.serializedValues)
      );
      formData.append('price', action.payload.price);
      formData.append('currencyTypeId', action.payload.currencyTypeId);

      return putFormDataWebRequest(
        api.MODIFY_OPTION_UNIT,
        formData,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while updating style option. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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

      formData.append(FORM_DATA_IMAGE_FILE_KEY, action.payload.file);
      formData.append('orderIndex', action.payload.orderIndex);
      formData.append('value', action.payload.value);
      formData.append('isMandatory', action.payload.isMandatory);
      formData.append('isBodyPosture', action.payload.isBodyPosture);
      formData.append('id', action.payload.id);
      formData.append('optionGroupId', action.payload.optionGroupId);
      formData.append(
        'serializedValues',
        JSON.stringify(action.payload.serializedValues)
      );
      formData.append('price', action.payload.price);
      formData.append('currencyTypeId', action.payload.currencyTypeId);

      return postFormDataWebRequest(
        api.ADD_OPTION_UNIT,
        formData,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while creating new style option. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
      return deleteWebRequest(api.DELETE_OPTION_UNIT_BY_ID, state$.value, [
        { key: 'optionUnitId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while deleteing style option. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
      return getWebRequest(api.GET_OPTION_GROUP_BY_ID, state$.value, [
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
                  new InfoMessage(
                    `Error occurred while getting style. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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

      return getWebRequest(api.GET_OPTION_UNIT_BY_ID, state$.value, [
        { key: 'optionUnitId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
              ),
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
                  new InfoMessage(
                    `Error occurred while getting style option for select. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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

      return deleteWebRequest(api.DELETE_OPTION_GROUP_BY_ID, state$.value, [
        { key: 'optionGroupId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                new InfoMessage(successResponse.message)
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
                  new InfoMessage(
                    `Error occurred while deleteing style. ${errorResponse}`,
                    InfoMessageType.Warning
                  )
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
