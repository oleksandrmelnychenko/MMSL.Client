import React from 'react';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';

import './menu.scss';
import { NavLink } from 'react-router-dom';

const Menu: React.FC = () => {
  const menuStyles = {
    root: {
      fontFamily: 'Segoe UI',
    },
    link: {
      textTransform: 'none',
      fontFamily: 'Segoe UI',
    },
  };
  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Dashboard',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon dashboard',
            },
          },
          expandAriaLabel: 'Dashboard',
          collapseAriaLabel: 'Dashboard',
        },
        {
          name: 'Order',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon order',
            },
          },
          icon: 'ShoppingCart',
          expandAriaLabel: 'Order',
          collapseAriaLabel: 'Order',
        },
        {
          name: 'Customer',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon customer',
            },
          },
          expandAriaLabel: 'Customer',
          collapseAriaLabel: 'Customer',
        },
        {
          name: 'Dealers',
          url: '/en/app/dealers',
          iconProps: {
            imageProps: {
              className: 'menu-icon dealers',
            },
          },
          expandAriaLabel: 'Dealers',
          collapseAriaLabel: 'Dealers',
        },
        {
          name: 'Stock',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon stock',
            },
          },
          expandAriaLabel: 'Stock',
          collapseAriaLabel: 'Stock',
        },
        {
          name: 'Documents',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon documents',
            },
          },
          expandAriaLabel: 'Documents',
          collapseAriaLabel: 'Documents',
        },
        {
          name: 'Activity History',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon activity',
            },
          },
          expandAriaLabel: 'Activity History',
          collapseAriaLabel: 'Activity History',
        },
        {
          name: 'Product Category',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon product',
            },
          },
          expandAriaLabel: 'Product Category',
          collapseAriaLabel: 'Product Category',
        },
        {
          name: 'Reports',
          url: '/',
          iconProps: {
            imageProps: {
              className: 'menu-icon reports',
            },
          },
          expandAriaLabel: 'Reports',
          collapseAriaLabel: 'Reports',
          links: [
            {
              name: 'Reports link 1',
              url: '/',
            },
          ],
        },
      ],
    },
  ];

  return (
    <Nav
      ariaLabel="Nav example with nested links"
      groups={navLinkGroups}
      styles={menuStyles}
    />
    // <nav className="menu">
    //   <ul className="menu__list">
    //     <li className="menu__item">
    //       <NavLink
    //         className="menu-icon dashboard"
    //         to={`/`}
    //         activeClassName="active">
    //         Dashboard
    //       </NavLink>
    //     </li>
    //   </ul>
    // </nav>
  );
};

export default Menu;
