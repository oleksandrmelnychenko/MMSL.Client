import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { reducer } from '../reducers/index';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../epic';

export const initStore = (history: any) => {
  const simpleRouter = routerMiddleware(history);
  const epicMiddleware = createEpicMiddleware();

  const logger = createLogger({
    collapsed: true,
  });

  const middleware = [epicMiddleware, simpleRouter, logger];

  const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });

  epicMiddleware.run(rootEpic as any);

  return store;
};
