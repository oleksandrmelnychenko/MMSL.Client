import { createSlice } from '@reduxjs/toolkit';

export const defaultAuthState = {
  isAuth: false,
  isError: false,
  errorMessage: '',
};

const auth = createSlice({
  name: 'auth',
  initialState: defaultAuthState,
  reducers: {
    signInAction(state, action) {
      return state;
    },
    authSuccessSignInAction(state, action) {
      state.isAuth = action.payload;
      return state;
    },

    failureSignInAction(state, action) {
      state.errorMessage = action.payload.errorMessage;
      return state;
    },
    logOut(state) {
      state.isAuth = false;
      return state;
    },
    clearErrorMessage(state) {
      state.errorMessage = '';
      return state;
    },
  },
});

export const authActions = auth.actions;
export default auth.reducer;
