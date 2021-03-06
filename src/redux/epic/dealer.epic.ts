import { Pagination } from './../../interfaces/index';
import { checkUnauthorized } from './../../helpers/error.helpers';
import {
  successCommonEpicFlow,
  errorCommonEpicFlow,
} from './../../helpers/action.helper';
import { switchMap, mergeMap, catchError, debounceTime } from 'rxjs/operators';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { dealerActions } from '../slices/dealer.slice';
import {
  controlActions,
  InfoMessage,
  InfoMessageType,
} from '../slices/control.slice';
import { getActiveLanguage } from 'react-localize-redux';
import {
  postWebRequest,
  getWebRequest,
  putWebRequest,
  deleteWebRequest,
} from '../../helpers/epic.helper';
import * as api from '../constants/api.constants';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../slices/dealer.slice';
import StoreHelper from '../../helpers/store.helper';

export const apiGetInfinitDealersPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.apiGetInfinitDealersPaginated.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());

      // const pagination: Pagination = state$.value.dealer.dealerState.pagination;
      const fromDate: Date | null | undefined = action.payload.fromDate;
      const toDate: Date | null | undefined = action.payload.toDate;

      return getWebRequest(api.GET_DEALERS_ALL, state$.value, [
        { key: 'limit', value: `${action.payload.paginationLimit}` },
        {
          key: 'pageNumber',
          value: `${action.payload.paginationPageNumber}`,
        },
        {
          key: 'searchPhrase',
          value: `${action.payload.searchPhrase}`,
        },
        {
          key: 'from',
          value: `${
            fromDate
              ? `${fromDate.getFullYear()}-${
                  fromDate.getMonth() + 1
                }-${fromDate.getDate()}`
              : ''
          }`,
        },
        {
          key: 'to',
          value: `${
            toDate
              ? `${toDate.getFullYear()}-${
                  toDate.getMonth() + 1
                }-${toDate.getDate()}`
              : ''
          }`,
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
                { type: 'ERROR_GET_DEALERS_PAGINATED' },
                controlActions.disabledStatusBar(),
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `Error occurred while get dealers paginated. ${errorResponse}`,
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

export const apiGetDealersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.apiGetDealersListPaginated.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const fromDate = state$.value.dealer.dealerState.fromDate;
      const toDate = state$.value.dealer.dealerState.toDate;

      return getWebRequest(api.GET_DEALERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pagination.paginationInfo.pageNumber}` },
        { key: 'limit', value: `${pagination.limit}` },
        {
          key: 'searchPhrase',
          value: `${state$.value.dealer.dealerState.search}`,
        },
        {
          key: 'from',
          value: `${
            fromDate
              ? `${fromDate.getFullYear()}-${
                  fromDate.getMonth() + 1
                }-${fromDate.getDate()}`
              : ''
          }`,
        },
        {
          key: 'to',
          value: `${
            toDate
              ? `${toDate.getFullYear()}-${
                  toDate.getMonth() + 1
                }-${toDate.getDate()}`
              : ''
          }`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateDealersList(
                successResponse.entities ? successResponse.entities : null
              ),
              dealerActions.updateDealerListPaginationInfo(
                successResponse.paginationInfo
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
              [{ type: 'ERROR' }, controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const apiDebounceGetDealersListPaginatedEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.apiDebounceGetDealersListPaginated.type),
    debounceTime(500),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const pagination: Pagination = state$.value.dealer.dealerState.pagination;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const fromDate = state$.value.dealer.dealerState.fromDate;
      const toDate = state$.value.dealer.dealerState.toDate;

      return getWebRequest(api.GET_DEALERS_ALL, state$.value, [
        { key: 'pageNumber', value: `${pagination.paginationInfo.pageNumber}` },
        { key: 'limit', value: `${pagination.limit}` },
        {
          key: 'searchPhrase',
          value: `${state$.value.dealer.dealerState.search}`,
        },
        {
          key: 'from',
          value: `${
            fromDate
              ? `${fromDate.getFullYear()}-${
                  fromDate.getMonth() + 1
                }-${fromDate.getDate()}`
              : ''
          }`,
        },
        {
          key: 'to',
          value: `${
            toDate
              ? `${toDate.getFullYear()}-${
                  toDate.getMonth() + 1
                }-${toDate.getDate()}`
              : ''
          }`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateDealersList(
                successResponse.entities ? successResponse.entities : null
              ),
              dealerActions.updateDealerListPaginationInfo(
                successResponse.paginationInfo
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
              [{ type: 'ERROR' }, controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const deleteDealerByIdEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerActions.deleteDealerById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return deleteWebRequest(api.DELETE_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
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
                { type: 'ERROR_DELETE_DEALER_BY_ID' },
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

export const getAndSelectDealersByIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.getAndSelectDealerById.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      openDetailsArgs.isOpen = true;
      openDetailsArgs.componentType = DealerDetilsComponents.DealerDetails;
      return getWebRequest(api.GET_DEALER_BY_ID, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.setSelectedDealer(successResponse),
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
                { type: 'ERROR_GET_AND_SELECT_DEALER_BY_ID' },
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

export const saveNewDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerActions.saveNewDealer.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return postWebRequest(
        api.CREATE_NEW_DEALER,
        action.payload,
        state$.value,
        true
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
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `${errorResponse.response.message}`,
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

export const updateDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerActions.updateDealer.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return putWebRequest(
        api.UPDATE_DEALER,
        action.payload,
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
                controlActions.showInfoMessage(
                  new InfoMessage(
                    `${errorResponse.response.message}`,
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

export const getStoresByDealerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerActions.getStoresByDealer.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_STORES_BY_DEALER, state$.value, [
        { key: 'dealerAccountId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.setDealerStores(successResponse),
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
                { type: 'ERROR_GET_STORES_BY_DEALERS_ID' },
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

export const updateDealerStoreEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerActions.updateDealerStore.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return putWebRequest(
        api.UPDATE_DEALER_STORE,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.setUpdateDealerStore(successResponse.body),
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
              [controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const addStoreToCurrentDealerEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.addStoreToCurrentDealer.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return postWebRequest(
        api.CREATE_DEALER_STORE,
        action.payload,
        state$.value,
        true
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.addNewStoreToCurrentDealer(successResponse.body),
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
              [controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const deleteCurrentDealerStoreEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.deleteCurrentDealerStore.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return deleteWebRequest(api.DELETE_CURRENT_DEALER_STORE, state$.value, [
        { key: 'storeId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateDealerStoresAfterDelete(successResponse.body),
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
                { type: 'ERROR_DELETE_CURRENT_DEALER_STORE' },
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

export const getStoreCustomersByStoreIdEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.getStoreCustomersByStoreId.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return getWebRequest(api.GET_CUSTOMERS_ALL, state$.value, [
        {
          key: 'storeId',
          value: `${action.payload}`,
        },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateTargetStoreCustomersList(
                successResponse.entities
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
              [{ type: 'ERROR' }, controlActions.disabledStatusBar()],
              action
            );
          });
        })
      );
    })
  );
};

export const deleteCurrentCustomerFromStoreEpic = (
  action$: AnyAction,
  state$: any
) => {
  return action$.pipe(
    ofType(dealerActions.deleteCurrentCustomerFromStore.type),
    switchMap((action: AnyAction) => {
      const languageCode = getActiveLanguage(state$.value.localize).code;
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      return deleteWebRequest(api.DELETE_CUSTOMER_BY_ID, state$.value, [
        { key: 'storeCustomerId', value: `${action.payload}` },
      ]).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateCustomersStoreAfterDeleteCustomer(
                successResponse.body
              ),
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
                { type: 'DELETE_CUSTOMER_BY_ID' },
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

export const updateStoreCustomerEpic = (action$: AnyAction, state$: any) => {
  return action$.pipe(
    ofType(dealerActions.updateStoreCustomer.type),
    switchMap((action: AnyAction) => {
      StoreHelper.getStore().dispatch(controlActions.enableStatusBar());
      const languageCode = getActiveLanguage(state$.value.localize).code;
      return putWebRequest(
        api.UPDATE_STORE_CUSTOMER,
        action.payload,
        state$.value
      ).pipe(
        mergeMap((successResponse: any) => {
          return successCommonEpicFlow(
            successResponse,
            [
              dealerActions.updateCustomerListAfterUpdateCustomer(
                successResponse.body
              ),
              dealerActions.setSelectedCustomerInCurrentStore(
                successResponse.body
              ),
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
                { type: 'ERROR_UPDATE_STORE_CUSTOMER' },
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
