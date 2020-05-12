import React from 'react';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';

import './menu.scss';

const Menu = () => {
  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Dashbord',
          url: '/',
          icon: 'ViewDashboard',
          expandAriaLabel: 'Expand Parent link 1',
          collapseAriaLabel: 'Collapse Parent link 1',
        },
        {
          name: 'Order',
          url: '/',
          icon: 'ShoppingCart',
          expandAriaLabel: 'Order',
          collapseAriaLabel: 'Order',
        },
        {
          name: 'Customer',
          url: '/',
          icon: 'ContactList',
          expandAriaLabel: 'Customer',
          collapseAriaLabel: 'Customer',
        },
        {
          name: 'Dealers',
          url: '/en/app/dealers',
          icon: 'FollowUser',
          expandAriaLabel: 'Dealers',
          collapseAriaLabel: 'Dealers',
        },
        {
          name: 'Stock',
          url: '/',
          icon: 'GiftboxOpen',
          expandAriaLabel: 'Stock',
          collapseAriaLabel: 'Stock',
        },
        {
          name: 'Documents',
          url: '/',
          icon: 'TextDocument',
          expandAriaLabel: 'Documents',
          collapseAriaLabel: 'Documents',
        },
        {
          name: 'Activity History',
          url: '/',
          icon: 'LineChart',
          expandAriaLabel: 'Activity History',
          collapseAriaLabel: 'Activity History',
        },
        {
          name: 'Product Category',
          url: '/',
          icon: 'LocationCircle',
          expandAriaLabel: 'Product Category',
          collapseAriaLabel: 'Product Category',
        },
        {
          name: 'Reports',
          url: '/',
          icon: 'DonutChart',
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
    <Nav ariaLabel="Nav example with nested links" groups={navLinkGroups} />
  );
};

export default Menu;
