import {
  ajaxPostResponse,
  ajaxPutResponse,
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
import { ajaxGetWebResponse } from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import { controlActions } from '../slices/control.slice';
import StoreHelper from '../../helpers/store.helper';
import { productStylePermissionsActions } from '../slices/productStylePermissions.slice';

export const apiGetAllStylePermissionsByProductIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(
      productStylePermissionsActions.apiGetAllStylePermissionsByProductId.type
    ),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(
        api.GET_ALL_PERMISSION_SETTINGS_BY_PRODUCT_ID,
        state$.value,
        [
          {
            key: 'productCategoryId',
            value: `${action.payload}`,
          },
        ]
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
                { type: 'ERROR_GET_ALL_STYLE_PERMISSIONS_BY_PRODUCT_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while getting permission settings by product id. ${errorResponse}`
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

export const apiCreateNewPermissionEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productStylePermissionsActions.apiCreateNewPermission.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPostResponse(
        api.CREATE_NEW_PERMISSION,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                `New style permission successfully created.`
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
                { type: 'ERROR_CREATE_NEW_PRODUCT_STYLE_PERMISSION' },
                controlActions.showInfoMessage(
                  `Error occurred while creating new product style permission. ${errorResponse}`
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

export const apiUpdatePermissionEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productStylePermissionsActions.apiUpdatePermission.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPutResponse(
        api.UPDATE_PERMISSION,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                `Style permission successfully updated.`
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
                { type: 'ERROR_EDITING_PRODUCT_STYLE_PERMISSION' },
                controlActions.showInfoMessage(
                  `Error occurred while editing product style permission. ${errorResponse}`
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

export const apiDeletePermissionEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productStylePermissionsActions.apiDeletePermission.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxDeleteResponse(api.DELETE_PERMISSION, state$.value, [
        {
          key: 'productPermissionSettingId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(
                `Style permission successfully deleted.`
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
                { type: 'ERROR_DELETEING_PRODUCT_STYLE_PERMISSION' },
                controlActions.showInfoMessage(
                  `Error occurred while deleting product style permission. ${errorResponse}`
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

export const apiGetOptionGroupsFromPermissionPerspectiveByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(
      productStylePermissionsActions
        .apiGetOptionGroupsFromPermissionPerspectiveById.type
    ),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(
        api.GET_OPTION_GROUPS_FROM_PERMISSION_PERSPECTIVE,
        state$.value,
        [
          {
            key: 'productId',
            value: `${action.payload.productId}`,
          },
          {
            key: 'productPermissionSettingId',
            value: `${action.payload.productPermissionSettingId}`,
          },
        ]
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
                { type: 'ERROR_GET_OPTION_GROUPS_FROM_PERMISSION_PERSPECTIVE' },
                controlActions.showInfoMessage(
                  `Error occurred while getting permissioned options. ${errorResponse}`
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

export const apiGetPermissionByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productStylePermissionsActions.apiGetPermissionById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_PERMISSION_BY_ID, state$.value, [
        {
          key: 'productPermissionSettingId',
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
                { type: 'ERROR_GET_PERMISSION_BY_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while getting permission setting by id. ${errorResponse}`
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

export const apiGetDealersByPermissionIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productStylePermissionsActions.apiGetDealersByPermissionId.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(
        api.GET_DEALERS_BY_PERMISSION_ID,
        state$.value,
        [
          {
            key: 'productPermissionId',
            value: `${action.payload}`,
          },
        ]
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
                { type: 'ERROR_GET_DEALERS_BY_PERMISSION_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while getting dealers by permission id. ${errorResponse}`
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

export const apiSearchDealersByPermissionProductIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(
      productStylePermissionsActions.apiSearchDealersByPermissionProductId.type
    ),
    debounceTime(500),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(
        api.SEARCH_DEALERS_BY_PERMISSION_PRODUCT_ID,
        state$.value,
        [
          {
            key: 'searchPhrase',
            value: `${action.payload.searchWord}`,
          },
          {
            key: 'productId',
            value: `${action.payload.productId}`,
          },
        ]
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
                { type: 'ERROR_SEARCH_DEALERS_BY_PERMISSION_PRODUCT_ID' },
                controlActions.showInfoMessage(
                  `Error occurred while search dealers by permission product id. ${errorResponse}`
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

export const apiBindDealersToPermissionEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productStylePermissionsActions.apiBindDealersToPermission.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPostResponse(
        api.BIND_DEALERS_TO_PERMISSION,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(`Successfully completed.`),
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
                { type: 'ERROR_BIND_DEALERS_TO_PERMISSION' },
                controlActions.showInfoMessage(
                  `Error occurred while binding dealers to product style permission. ${errorResponse}`
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
