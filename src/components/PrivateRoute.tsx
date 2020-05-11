import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { getActiveLanguage, LocalizeState } from 'react-localize-redux';

import { IApplicationState } from '../redux/reducers';

interface IPrivateRouteProps {
  path: string;
  component: any;
}

export const PrivateRouter: React.FC<IPrivateRouteProps> = (props) => {
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const isAuth = useSelector<IApplicationState, boolean>(
    (state) => state.auth.isAuth
  );
  const currentCode = getActiveLanguage(localize).code;
  const { component: Component, ...rest } = props;

  return isAuth ? (
    <Route path={rest.path} component={Component} />
  ) : (
    <Redirect
      from={rest.path}
      to={`/${currentCode}/account-security/sign-in`}
    />
  );
};

export default PrivateRouter;
