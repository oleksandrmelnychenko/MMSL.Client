import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import { controlActions } from '../../../redux/slices/control.slice';
import './menu.scss';
import { IApplicationState } from '../../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';

interface IMenuItem {
  title: string;
  className: string;
  link: string;
  children?: IMenuItem[];
}

const Menu: React.FC = () => {
  const dispatch = useDispatch();
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const languageCode = getActiveLanguage(localize).code;

  const [isOpenSubMenu, setIsOpenSubMenu] = useState(false);

  const onMenuClick = () => {
    setIsOpenSubMenu(false);
    dispatch(dealerActions.setSelectedDealer(null));
    dispatch(controlActions.closeInfoPanelWithComponent());
    dispatch(productSettingsActions.updateSearchWordOptionGroup(''));
  };
  const history = useLocation();

  const pathNamesSubMenu = [
    `/${languageCode}/app/styles`,
    `/${languageCode}/app/measurements`,
    `/${languageCode}/app/timelines`,
  ];

  useEffect(() => {
    if (pathNamesSubMenu.includes(history.pathname)) {
      setIsOpenSubMenu(true);
    }
  }, [history]);

  const menu: IMenuItem[] = [
    {
      title: 'Dashboard',
      className: 'dashboard',
      link: `/${languageCode}/app/dashboard`,
    },
    {
      title: 'Order',
      className: 'order',
      link: `/${languageCode}/app/order`,
    },
    {
      title: 'Customer',
      className: 'customer',
      link: `/${languageCode}/app/customer`,
    },
    {
      title: 'Dealers',
      className: 'dealers',
      link: `/${languageCode}/app/dealers`,
    },
    {
      title: 'Stock',
      className: 'stock',
      link: `/${languageCode}/app/stock`,
    },
    {
      title: 'Documents',
      className: 'documents',
      link: `/${languageCode}/app/documents`,
    },
    {
      title: 'Activity History',
      className: 'activity',
      link: `/${languageCode}/app/activity`,
    },
    {
      title: 'Products',
      className: 'product',
      link: `/${languageCode}/app/product/product-categories`,
    },
    {
      title: 'Settings',
      className: 'settings',
      link: `/${languageCode}/app/styles`,
      children: [
        {
          title: 'Styles',
          className: 'stock',
          link: `/${languageCode}/app/styles`,
        },
        {
          title: 'Measurements',
          className: 'documents',
          link: `/${languageCode}/app/measurements`,
        },
        {
          title: 'Timelines',
          className: 'activity',
          link: `/${languageCode}/app/timelines`,
        },
      ],
    },
    {
      title: 'Reports',
      className: 'reports',
      link: `/${languageCode}/app/reports`,
    },
  ];

  const renderList = (list: IMenuItem[], isSubMenu?: boolean) => (
    <ul className={`menu__list${isSubMenu ? ' menu__list_sub' : ''}`}>
      {list.map((item, index) => (
        <li
          key={index}
          className={`menu__item${
            item.children && isOpenSubMenu ? ' menu__item_with-sub-menu' : ''
          }`}>
          <NavLink
            onClick={() => {
              item.children ? setIsOpenSubMenu(true) : onMenuClick();
            }}
            className={`menu__link ${item.className}`}
            to={item.link}
            activeClassName={!item.children ? 'active' : ''}>
            {item.title}
          </NavLink>

          {item.children && isOpenSubMenu
            ? renderList(item.children, true)
            : null}
        </li>
      ))}
    </ul>
  );

  return <div className="menu">{renderList(menu)}</div>;
};

export default Menu;
