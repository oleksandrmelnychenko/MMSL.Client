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
  const ChangeLocaleSegment = (code: string) => {
    const segments = props.match.url.substr(1).split('/');
    segments[0] = code;

    let url = '';
    segments.forEach((element: string) => {
      return (url += '/' + element);
    });
    return url;
  };

  return (
    <Switch>
      <Redirect
        exact
        from={`${props.match.url}`}
        to={`${props.match.url}/sign-in`}
      />

      <Redirect
        exact
        from={`${props.match.url}`}
        to={`${ChangeLocaleSegment(current.code)}`}
      />

      <Route exact path={`${props.match.url}/sign-in`} component={SignIn} />

      <Route
        exact
        path={`${props.match.url}/forgot-password`}
        component={ForgotPassword}
      />

      <Redirect from="*" to={`/${current.code}/404`} />
    </Switch>
  );
};

export default AccountSecurity;
