import rootEpic from '../epic';
import { createLogger } from 'redux-logger';
import { reducer } from '../reducers/index';
import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';

export const initStore = () => {
  const epicMiddleware = createEpicMiddleware();

  const logger = createLogger({
    collapsed: true,
  });

  const middleware = [epicMiddleware, logger];

  const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });

  epicMiddleware.run(rootEpic as any);

  return store;
};
