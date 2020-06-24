import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Redirect, Route } from 'react-router-dom';
import { getActiveLanguage, LocalizeState } from 'react-localize-redux';

import PrivateRoute from './PrivateRoute';
import Dashboard from './master/Dashboard';
import { IApplicationState } from '../redux/reducers';
import PageNotFound from './master/PageNotFound';
import AccountSecurity from './account-security/AccountSecurity';
import { IAuthState } from '../interfaces/identity';

export interface IRoutingProps {
  onEnter: void;
}

export const Routing: React.FC<IRoutingProps> = (props) => {
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const auth = useSelector<IApplicationState, IAuthState>(
    (state) => state.auth
  );

  const languageCode = getActiveLanguage(localize).code;
  if (!auth.isAuth)
    return (
      <Switch>
        <Redirect exact from={`/`} to={`/${languageCode}`} />

        <Redirect
          exact
          from={`/${languageCode}`}
          to={`/${languageCode}/account-security`}
        />

        <Redirect
          exact
          from={`/${languageCode}/account-security`}
          to={`/${languageCode}/account-security/sign-in`}
        />

        <Route
          path={`/${languageCode}/account-security`}
          component={AccountSecurity}
        />
      </Switch>
    );

  return (
    <Switch>
      <Redirect exact from="/" to={`/${languageCode}`} />

      <Redirect exact from={`/${languageCode}`} to={`/${languageCode}/app`} />

      <PrivateRoute path={`/${languageCode}/app`} component={Dashboard} />

      <Route path={`/${languageCode}/404`} component={PageNotFound} />

      <Redirect from="*" to={`/${languageCode}/404`} />
    </Switch>
  );
};

export default Routing;
