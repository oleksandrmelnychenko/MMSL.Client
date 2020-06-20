import React from 'react';
import {
  DefaultButton,
  IContextualMenuItem,
  IContextualMenuProps,
  DirectionalHint,
  Persona,
  IPersonaSharedProps,
  PersonaSize,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate, LocalizeState } from 'react-localize-redux';

import './header.scss';
import { TokenHelper } from '../../../helpers/token.helper';
import { IApplicationState } from '../../../redux/reducers';
import { authActions } from '../../../redux/slices/auth.slice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const translate = getTranslate(
    useSelector<IApplicationState, LocalizeState>((state) => state.localize)
  );

  const logOut = (event: any) => {
    event!.stopPropagation();
    dispatch(authActions.logOut());
    TokenHelper.removeAccessToken();
  };

  const menuStyles = {
    root: {
      minWidth: 'auto',
      padding: '5px',
      margin: '4px 0',
      border: 'none',
      background: '#fff',
      'box-sizing': 'content-box',
    },
  };
  const menuItems: IContextualMenuItem[] = [
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

  const examplePersona: IPersonaSharedProps = {
    imageInitials: 'A',
  };

  return (
    <div className="header">
      <div className="header__logo"></div>
      <div className="header_right">
        <DefaultButton
          styles={menuStyles}
          persistMenu={true}
          menuProps={menuProps}
        >
          <div>
            <Persona
              {...examplePersona}
              text={TokenHelper.parseJwt(TokenHelper.getAccessToken()).email}
              size={PersonaSize.size32}
              className="header__user-icon"
            />
          </div>
        </DefaultButton>
      </div>
    </div>
  );
};

export default Header;
