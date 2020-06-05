import { AnyAction } from 'redux';
import { from, of } from 'rxjs';
import { List } from 'linq-typescript';

/// Puts success/error pending actions in to the action
export const assignPendingActions = (
  action: AnyAction,
  successPendingActions: Array<AnyAction> = [],
  errorPendingActions: Array<AnyAction> = [],
  successPendingDelegate?: (successResponse: any) => void,
  errorPendingDelegate?: (errorResponse: any) => void
) => {
  action.successPendingActions = successPendingActions;
  action.errorPendingActions = errorPendingActions;
  action.successPendingDelegate = successPendingDelegate;
  action.errorPendingDelegate = errorPendingDelegate;

  return action;
};

/// Extracts `success` pending actions
export const extractSuccessPendingActions = (action: AnyAction) => {
  let result: Array<AnyAction> = [];

  if (action && action.successPendingActions) {
    action.successPendingActions.forEach((pendingAction: AnyAction) =>
      result.push(pendingAction)
    );
  }

  return result;
};

/// Extracts `error` pending actions
export const extractErrorPendingActions = (action: AnyAction) => {
  let result: Array<AnyAction> = [];

  if (action && action.errorPendingActions) {
    action.errorPendingActions.forEach((pendingAction: AnyAction) =>
      result.push(pendingAction)
    );
  }

  return result;
};

/// Extracts `success` pending delegate
export const extractSuccessPendingDelegate = (action: AnyAction) => {
  let result: (successResponse: any) => void = (args: any) => {};

  if (action && action.successPendingDelegate) {
    result = action.successPendingDelegate;
  }

  return result;
};

/// Extracts `error` pending delegate
export const extractErrorPendingDelegate = (action: AnyAction) => {
  let result: (errorResponse: any) => void = (args: any) => {};

  if (action && action.errorPendingDelegate) {
    result = action.errorPendingDelegate;
  }

  return result;
};

export const successCommonEpicFlow = (
  successResponseArgs: any,
  flowActions: AnyAction[],
  rootAction: AnyAction
) => {
  let actionsStack = [
    ...flowActions,
    ...extractSuccessPendingActions(rootAction),
  ];
  actionsStack = new List(actionsStack)
    .where((item) => item !== null && item !== undefined)
    .toArray();

  let pendingDelegate = extractSuccessPendingDelegate(rootAction);
  if (pendingDelegate) pendingDelegate(successResponseArgs);

  let rxResult: any = null;

  if (actionsStack.length > 0) {
    rxResult = from(actionsStack);
  } else {
    rxResult = of({
      type: 'SUCCESS_COMMON_ACTION',
      payload: successResponseArgs,
    });
  }

  return rxResult;
};

export const errorCommonEpicFlow = (
  errorResponseArgs: any,
  flowActions: AnyAction[],
  rootAction: AnyAction
) => {
  let actionsStack = [
    ...flowActions,
    ...extractErrorPendingActions(rootAction),
  ];
  actionsStack = new List(actionsStack)
    .where((item) => item !== null && item !== undefined)
    .toArray();

  let pendingDelegate = extractErrorPendingDelegate(rootAction);
  if (pendingDelegate) pendingDelegate(errorResponseArgs);

  let rxResult: any = null;

  if (actionsStack.length > 0) {
    rxResult = from(actionsStack);
  } else {
    rxResult = of({
      type: 'ERROR_COMMON_ACTION',
      payload: errorResponseArgs,
    });
  }

  return rxResult;
};
