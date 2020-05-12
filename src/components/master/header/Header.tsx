import React from 'react';
import {
  DefaultButton,
  IContextualMenuItem,
  ContextualMenuItemType,
  IContextualMenuProps,
  DirectionalHint,
} from 'office-ui-fabric-react';
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

  const menuStyles = {
    root: {
      minWidth: 'auto',
      padding: '0',
      margin: '10px 0',
      border: 'none',
      background: '#fff',
    },
  };
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'Settings',
      text: translate('settings') as string,
    },
    {
      key: 'divider_1',
      itemType: ContextualMenuItemType.Divider,
    },
    {
      key: 'logOut',
      text: translate('logOut') as string,
      onClick: (event) => logOut(event),
    },
  ];

  const menuProps: IContextualMenuProps = {
    shouldFocusOnMount: true,
    shouldFocusOnContainer: true,
    className: 'info-scope-menu',
    directionalHint: DirectionalHint.bottomRightEdge,
    directionalHintFixed: true,
    items: menuItems,
    styles: {
      subComponentStyles: {
        callout: {},
        menuItem: {
          root: {
            color: '#000',
            textAlign: 'right',
          },
        },
      },
    },
  };

  return (
    <div className="header">
      <div className="header__logo"></div>
      <div className="header_right">
        <DefaultButton
          styles={menuStyles}
          persistMenu={true}
          menuProps={menuProps}>
          <div>{TokenHelper.parseJwt(TokenHelper.getAccessToken()).email}</div>
        </DefaultButton>
      </div>
    </div>
  );
};

export default Header;
