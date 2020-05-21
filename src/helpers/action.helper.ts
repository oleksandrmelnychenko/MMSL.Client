import { AnyAction } from 'redux';

/// Puts success/error pending actions in to the action
export const assignPendingActions = (
  action: AnyAction,
  successPendingActions: Array<AnyAction> = [],
  errorPendingActions: Array<AnyAction> = [],
  successPendingDelegate?: (successResponse: any) => void
) => {
  action.successPendingActions = successPendingActions;
  action.errorPendingActions = errorPendingActions;
  action.successPendingDelegate = successPendingDelegate;

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
