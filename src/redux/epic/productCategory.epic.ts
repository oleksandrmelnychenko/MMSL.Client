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
  putWebRequest,
  deleteWebRequest,
  postFormDataWebRequest,
  putFormDataWebRequest,
  postWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { productActions } from '../slices/product.slice';
import StoreHelper from '../../helpers/store.helper';

const FORM_DATA_IMAGE_FILE_KEY = 'file';

export const apiGetAllProductCategoriesEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetAllProductCategories.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return getWebRequest(api.GET_ALL_PRODUCT_CATEGORY, state$.value, []).pipe(
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
                { type: 'ERROR_GET_ALL_PRODUCT_CATEGORIES' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting all product categories. ${errorResponse}`,
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

export const apiGetAllProductCategoryAnUpdateListEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetAllProductCategoryAnUpdateList.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_ALL_PRODUCT_CATEGORY, state$.value, []).pipe(
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

      return postFormDataWebRequest(
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while creating new product. ${errorResponse}`,
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

      return putFormDataWebRequest(
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while updating product. ${errorResponse}`,
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

export const updateProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productActions.apiUpdateProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return putWebRequest(
        api.UPDATE_PRODUCT_CATEGORY,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
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
      return putWebRequest(
        api.UPDATE_PRODUCT_CATEGORY_GROUPS_LIST,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
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
                    `Error occurred while updating product options stack. ${errorResponse}`,
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

export const deleteProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productActions.apiDeleteProductCategory.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return deleteWebRequest(api.DELETE_PRODUCT_CATEGORY, state$.value, [
        { key: 'productCategoryId', value: `${action.payload}` },
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
                    `Error occurred while deleteing category. ${errorResponse}`,
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

export const apiGetProductCategoryByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetProductCategoryById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return getWebRequest(api.GET_PRODUCT_CATEGORY_BY_ID, state$.value, [
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
                  new InfoMessage(
                    `Error occurred while getting product. ${errorResponse}`,
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
export const apiGetProductCategoryByIdBodyPosturePerspectiveEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetProductCategoryByIdBodyPosturePerspective.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return getWebRequest(api.GET_PRODUCT_CATEGORY_BY_ID, state$.value, [
        { key: `productCategoryId`, value: `${action.payload}` },
        { key: `showBodyPostureOnly`, value: `${true}` },
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
                {
                  type:
                    'ERROR_API_GET_PRODUCT_CATEGORY_BY_ID_BODY_POSTURE_PERSPECTIVE',
                },
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting product from body posture perspective. ${errorResponse}`,
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

export const getMeasurementsByProductEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetMeasurementsByProduct.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_MEASUREMENTS_BY_PRODUCT, state$.value, [
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

      return postFormDataWebRequest(
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while creating new measurement. ${errorResponse}`,
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

export const apiAssignProductTimelineEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.assignProductDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return postWebRequest(
        api.PRODUCT_DELIVERY_TIMELINE_ASSIGN,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
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
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while assign timeline for the product. ${errorResponse}`,
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

export const apiGetAllProductMeasurementsByProductIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productActions.apiGetAllProductMeasurementsByProductId.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return getWebRequest(api.GET_ALL_MEASUREMENTS_BY_PRODUCT, state$.value, [
        { key: 'productId', value: `${action.payload}` },
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
                { type: 'ERROR_GET_MEASUREMENTS_BY_PRODUCT' },
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while getting measurements by product. ${errorResponse}`,
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
