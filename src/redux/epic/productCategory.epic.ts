import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxGetWebResponse,
  ajaxPostResponse,
  ajaxPutResponse,
  ajaxDeleteResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import * as controlActions from '../../redux/actions/control.actions';
import * as productCategoryTypes from '../constants/productCategory.types.constants';
import * as productCategoryActions from '../actions/productCategory.actions';
import StoreHelper from '../../helpers/store.helper';

export const getAllProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productCategoryTypes.GET_ALL_PRODUCT_CATEGORY),
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
              productCategoryActions.successGetAllProductCategory(
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

export const addNewProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productCategoryTypes.ADD_NEW_PRODUCT_CATEGORY),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPostResponse(
        api.ADD_PRODUCT_CATEGORY,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          debugger;
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
              [controlActions.disabledStatusBar()],
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
    ofType(productCategoryTypes.UPDATE_PRODUCT_CATEGORY),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return ajaxPutResponse(
        api.UPDATE_PRODUCT_CATEGORY,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          debugger;
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

export const deleteProductCategoryEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productCategoryTypes.DELETE_PRODUCT_CATEGORY),
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
              productCategoryActions.getAllProductCategory(),
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
