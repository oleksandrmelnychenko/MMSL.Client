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

export const getOptionGroupByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(
      productSettingsActions.getAndSelectOptionGroupForSingleEditById.type
    ),
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

export const saveEditOptionGroupEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.saveEditOptionGroup.type),
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

export const saveNewOptionGroupEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.saveNewOptionGroup.type),
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

export const modifyOptionUnitsOrderEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.modifyOptionUnitsOrder.type),
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

export const updateOptionUnitEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.updateOptionUnit.type),
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

export const saveNewOptionUnitEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.saveNewOptionUnit.type),
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

export const deleteOptionUnitByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.deleteOptionUnitById.type),
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

/// TODO: need to re-check
export const getAndSelectOptionGroupByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiGetAndSelectOptionGroupById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxGetWebResponse(api.GET_OPTION_GROUP_BY_ID, state$.value, [
        { key: 'groupId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.disabledStatusBar(),
              productSettingsActions.changeTargetOptionGroupForUnitsEdit(
                successResponse
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

export const getAndSelectOptionUnitForSingleEditByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.getAndSelectOptionUnitForSingleEditById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return ajaxGetWebResponse(api.GET_OPTION_UNIT_BY_ID, state$.value, [
        { key: 'optionUnitId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              controlActions.showInfoMessage(successResponse.message),
              productSettingsActions.updateSingleEditOptionUnit(
                successResponse
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

export const deleteOptionGroupByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.deleteOptionGroupById.type),
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

export const getAllDeliveryTimelinesEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiGetAllDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxGetWebResponse(
        api.GET_ALL_DELIVERY_TIMELINES,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              productSettingsActions.successGetAllDeliveryTimelines(
                successResponse
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
                  `Error occurred while getting delivery timelines. ${errorResponse}`
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

export const addNewDeliveryTimelineEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiCreateNewDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxPostResponse(
        api.ADD_DELIVERY_TIMELINE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              productSettingsActions.apiGetAllDeliveryTimeline(),
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
                  `Error occurred while creating new delivery timeline. ${errorResponse}`
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

export const updateDeliveryTimelineEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsActions.apiUpdateDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxPutResponse(
        api.UPDATE_DELIVERY_TIMELINE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              productSettingsActions.apiGetAllDeliveryTimeline(),
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
                  `Error occurred while updating delivery timeline. ${errorResponse}`
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

export const deleteDeliveryTimelineByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(productSettingsActions.apiDeleteDeliveryTimeline.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      return ajaxDeleteResponse(
        api.DELETE_DELIVERY_TIMELINE_BY_ID,
        state$.value,
        [{ key: 'deliveryTimelineId', value: `${action.payload}` }]
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              productSettingsActions.apiGetAllDeliveryTimeline(),
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
                  `Error occurred while deleting delivery timeline. ${errorResponse}`
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
