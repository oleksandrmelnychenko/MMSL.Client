import React from 'react';
import { useSelector } from 'react-redux';
import { getActiveLanguage, LocalizeState } from 'react-localize-redux';
import { Route, Switch, Redirect, match } from 'react-router-dom';

import SignIn from './SignIn';
import ForgotPassword from './ForgotPassword';
import { IApplicationState } from '../../redux/reducers';

export interface IAccountSecurityProps {
  match: match;
}

const AccountSecurity: React.FC<IAccountSecurityProps> = (props) => {
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const current = getActiveLanguage(localize);

  return (
    <Switch>
      <Route
        path={`${props.match.url}/forgot-password`}
        component={ForgotPassword}
      />

      <Route path={`${props.match.url}/sign-in`} component={SignIn} />

      <Redirect from="*" to={`/${current.code}/404`} />
    </Switch>
  );
};

export default AccountSecurity;
