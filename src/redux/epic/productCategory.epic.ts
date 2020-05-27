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
  ajaxPutResponse,
  ajaxDeleteResponse,
  ajaxPostFormDataResponse,
  ajaxPutFormDataResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import { controlActions } from '../slices/control.slice';

import { productActions } from '../slices/product.slice';
import StoreHelper from '../../helpers/store.helper';
import { List } from 'linq-typescript';
import { EntityBase } from '../../interfaces';

const FORM_DATA_IMAGE_FILE_KEY = 'file';

export const getAllProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productActions.apiGetAllProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(
        api.GET_ALL_PRODUCT_CATEGORY,
        state$.value,
        []
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              productActions.successGetAllProductCategory(successResponse),
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
                { type: 'ERROR_GET_ALL_PRODUCT_CATEGORY' },
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

export const apiAddNewProductCategoryEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiAddNewProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      const formData: FormData = new FormData();
      formData.append(FORM_DATA_IMAGE_FILE_KEY, action.payload.imageBlob);

      return ajaxPostFormDataResponse(
        api.ADD_PRODUCT_CATEGORY,
        formData,
        state$.value,
        [
          {
            key: 'name',
            value: `${action.payload.name}`,
          },
          {
            key: 'description',
            value: `${action.payload.description}`,
          },
        ]
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(successResponse.message),
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
                  `Error occurred while creating new product category. ${errorResponse}`
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

export const apiUpdateProductCategoryEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiUpdateProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      const formData: FormData = new FormData();
      formData.append(FORM_DATA_IMAGE_FILE_KEY, action.payload.imageBlob);

      return ajaxPutFormDataResponse(
        api.UPDATE_PRODUCT_CATEGORY,
        formData,
        state$.value,
        [
          {
            key: 'name',
            value: `${action.payload.name}`,
          },
          {
            key: 'description',
            value: `${action.payload.description}`,
          },
          {
            key: 'imageUrl',
            value: `${action.payload.imageUrl}`,
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
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(successResponse.message),
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
                  `Error occurred while updating product category. ${errorResponse}`
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

export const updateProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productActions.apiUpdateProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPutResponse(
        api.UPDATE_PRODUCT_CATEGORY,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(successResponse.message),
            ],
            action
          );
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            return errorCommonEpicFlow(
              errorResponse,
              [
                { type: 'ERROR_UPDATE_CATEGORY_PRODUCT' },
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

export const apiSaveUpdatedProductGroupsEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiSaveUpdatedProductGroups.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPutResponse(
        api.UPDATE_PRODUCT_CATEGORY_GROUPS_LIST,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(successResponse.message),
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
                  `Error occurred while updating product options stack. ${errorResponse}`
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

export const deleteProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productActions.apiDeleteProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxDeleteResponse(api.DELETE_PRODUCT_CATEGORY, state$.value, [
        { key: 'productCategoryId', value: `${action.payload}` },
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
                  `Error occurred while deleteing category. ${errorResponse}`
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

export const apiGetProductCategoryByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetProductCategoryById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxGetWebResponse(api.GET_PRODUCT_CATEGORY_BY_ID, state$.value, [
        { key: `productCategoryId`, value: `${action.payload}` },
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
                { type: 'ERROR_API_GET_PRODUCT_CATEGORY_BY_ID' },
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  `Error occurred while getting product category. ${errorResponse}`
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

export const getMeasurementsByProductEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetMeasurementsByProduct.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_MEASUREMENTS_BY_PRODUCT, state$.value, [
        {
          key: 'productCategoryId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              productActions.successGetMeasurmentsByProduct(successResponse),
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

export const apiAddNewMeasurementEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productActions.apiAddNewMeasurement.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxPostFormDataResponse(
        api.ADD_NEW_MEASUREMENT,
        action.payload,
        state$.value,
        []
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              controlActions.showInfoMessage(successResponse.message),
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
                  `Error occurred while creating new measurement. ${errorResponse}`
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
