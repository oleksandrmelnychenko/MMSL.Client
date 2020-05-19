import { createAction } from '@reduxjs/toolkit';
import * as types from '../constants/auth.types.constants';
import { IAuthentication, IFailureAuth } from '../../interfaces';

export const signInAction = createAction<IAuthentication>(types.REQUEST_SIGNIN);
export type SignInAction = ReturnType<typeof signInAction>;

export const failureSignInAction = createAction<IFailureAuth>(
  types.FAILURE_SIGNIN
);
export type FailureSignInAction = ReturnType<typeof failureSignInAction>;

export const failureSignUpAction = createAction<IFailureAuth>(
  types.FAILURE_SIGNUP
);
export type FailureSignUpAction = ReturnType<typeof failureSignUpAction>;

export const signUpAction = createAction<IAuthentication>(types.REQUEST_SIGNUP);
export type SignUpAction = ReturnType<typeof signUpAction>;

export const authSuccessSignInAction = createAction<boolean>(
  types.SUCCESS_SIGNIN
);
export type AuthSuccessAction = ReturnType<typeof authSuccessSignInAction>;

export const logOut = createAction(types.LOGOUT);

export const clearErrorMessage = createAction(types.CLEAR_ERROR_MESSAGE);

export const logout = createAction(types.LOGOUT);
