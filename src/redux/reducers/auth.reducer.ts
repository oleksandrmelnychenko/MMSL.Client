import * as actions from '../actions/auth.actions';
import { createReducer } from '@reduxjs/toolkit';

export const defaultAuthState = {
  isAuth: false,
  errorMessage: '',
};

export const authReducer = createReducer(defaultAuthState, (builder) =>
  builder
    .addCase(actions.authSuccessSignInAction, (state, action) => {
      state.isAuth = action.payload;
    })
    .addCase(actions.failureSignInAction, (state, action) => {
      state.errorMessage = action.payload.errorMessage;
    })
    .addCase(actions.authSuccessSignUpAction, (state, action) => {
      state.isAuth = action.payload;
    })
    .addCase(actions.failureSignUpAction, (state, action) => {
      state.errorMessage = action.payload.errorMessage;
    })
    .addCase(actions.logout, (state, action) => {
      state.isAuth = false;
    })
    .addCase(actions.clearErrorMessage, (state, action) => {
      state.errorMessage = '';
    })
);
