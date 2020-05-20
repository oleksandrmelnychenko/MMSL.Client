import {
  ajaxPutResponse,
  ajaxPutFormDataResponse,
  ajaxPostFormDataResponse,
} from './../../helpers/epic.helper';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  extractSuccessPendingActions,
  extractErrorPendingActions,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import * as productSettingsTypes from '../constants/productSettings.types.constants';
import { getActiveLanguage } from 'react-localize-redux';
import {
  ajaxPostResponse,
  ajaxGetWebResponse,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import * as controlActions from '../../redux/actions/control.actions';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';

export const saveNewOptionGroupEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsTypes.SAVE_NEW_OPTION_GROUP),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return ajaxPostResponse(
        api.CREATE_NEW_OPTION_GROUP,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            controlActions.showInfoMessage(
              'New option group created successfully'
            ),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.showInfoMessage(
                `Error occurred while creating new option group. ${errorResponse}`
              ),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const getAllOptionGroupsListEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsTypes.GET_ALL_OPTION_GROUPS_LIST),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return ajaxGetWebResponse(api.GET_ALL_OPTION_GROUPS, state$.value).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [
            productSettingsActions.updateOptionGroupList(successResponse),
            ...extractSuccessPendingActions(action),
          ];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.showInfoMessage(
                `Error occurred while getting option groups list. ${errorResponse}`
              ),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const modifyOptionUnitsOrderEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsTypes.MODIFY_OPTION_UNITS_ORDER),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      return ajaxPutResponse(
        api.MODIFY_OPTION_UNITS_ORDER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          let successResultFlow = [...extractSuccessPendingActions(action)];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.showInfoMessage(
                `Error occurred while updating option units order. ${errorResponse}`
              ),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const updateOptionUnitEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsTypes.UPDATE_OPTION_UNIT),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      debugger;

      const formData: FormData = new FormData();
      formData.append('file', action.payload.imageBlob);

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
          debugger;
          let successResultFlow = [...extractSuccessPendingActions(action)];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          debugger;
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.showInfoMessage(
                `Error occurred while updating option unit. ${errorResponse}`
              ),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};

export const saveNewOptionUnitEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(productSettingsTypes.SAVE_NEW_OPTION_UNIT),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;

      const formData: FormData = new FormData();
      formData.append('file', action.payload.imageBlob);

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
          let successResultFlow = [...extractSuccessPendingActions(action)];

          return from(successResultFlow);
        }),
        catchError((errorResponse: any) => {
          return checkUnauthorized(errorResponse.status, languageCode, () => {
            let errorResultFlow = [
              controlActions.showInfoMessage(
                `Error occurred while creating new option unit. ${errorResponse}`
              ),
              ...extractErrorPendingActions(action),
            ];

            return from(errorResultFlow);
          });
        })
      );
    })
  );
};
