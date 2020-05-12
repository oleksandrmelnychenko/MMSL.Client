import React from 'react';
import { DefaultButton } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate, LocalizeState } from 'react-localize-redux';

import './header.scss';
import { TokenHelper } from '../../../helpers/token.helper';
import { IApplicationState } from '../../../redux/reducers';
import * as authAction from '../../../redux/actions/auth.actions';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const translate = getTranslate(
    useSelector<IApplicationState, LocalizeState>((state) => state.localize)
  );

  const logOut = (event: any) => {
    event!.stopPropagation();
    dispatch(authAction.logOut());
    TokenHelper.removeAccessToken();
  };

  return (
    <div className="header">
      <div className="header__logo"></div>
      <div className="header_right">
        <DefaultButton
          text={translate('logout').toString()}
          onClick={logOut}
          allowDisabledFocus
        />
      </div>
    </div>
  );
};

export default Header;
