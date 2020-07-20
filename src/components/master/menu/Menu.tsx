import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import { controlActions } from '../../../redux/slices/control.slice';
import { productActions } from '../../../redux/slices/product.slice';
import './menu.scss';
import { IApplicationState } from '../../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import { TokenHelper } from '../../../helpers/token.helper';
import { List } from 'linq-typescript';
import { RoleType } from '../../../interfaces/identity';

interface IMenuItem {
  title: string;
  className: string;
  link: string;
  children?: IMenuItem[];
}

const DASHBOARD_MENU_TITLE: string = 'Dashboard';
const ORDER_PROFILES_MENU_TITLE: string = 'Order';
const CUSTOMER_MENU_TITLE: string = 'Customer';
const DEALERS_MENU_TITLE: string = 'Dealers';
const STOCK_MENU_TITLE: string = 'Stock';
const DOCUMENTS_MENU_TITLE: string = 'Documents';
const ACTIVITY_HISTORY_MENU_TITLE: string = 'Activity History';
const PRODUCTS_MENU_TITLE: string = 'Products';
const SETTINGS_MENU_TITLE: string = 'Settings';
const REPORTS_MENU_TITLE: string = 'Reports';

const Menu: React.FC = () => {
  const dispatch = useDispatch();
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const languageCode = getActiveLanguage(localize).code;

  const [isOpenSubMenu, setIsOpenSubMenu] = useState(false);

  const onMenuClick = (item: IMenuItem) => {
    setIsOpenSubMenu(false);
    dispatch(dealerActions.setSelectedDealer(null));
    dispatch(controlActions.closeInfoPanelWithComponent());
    dispatch(productSettingsActions.updateSearchWordOptionGroup(''));

    if (item.title !== PRODUCTS_MENU_TITLE) {
      dispatch(productActions.disposeProductCategoryStates());
    }
  };

  const history = useLocation();

  const pathNamesSubMenu = [
    `/${languageCode}/app/styles`,
    // Old pages, are not neccessary now
    // `/${languageCode}/app/measurements`,
    // `/${languageCode}/app/timeline`,
  ];
  useEffect(() => {
    if (pathNamesSubMenu.includes(history.pathname)) {
      setIsOpenSubMenu(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const menu: IMenuItem[] = [
    {
      title: DASHBOARD_MENU_TITLE,
      className: 'dashboard',
      link: `/${languageCode}/app/dashboard`,
    },
    {
      title: ORDER_PROFILES_MENU_TITLE,
      className: 'order',
      link: `/${languageCode}/app/order-profiles`,
    },
    {
      title: CUSTOMER_MENU_TITLE,
      className: 'customer',
      link: `/${languageCode}/app/customers`,
    },
    {
      title: DEALERS_MENU_TITLE,
      className: 'dealers',
      link: `/${languageCode}/app/dealers`,
    },
    {
      title: STOCK_MENU_TITLE,
      className: 'stock',
      link: `/${languageCode}/app/stock`,
    },
    {
      title: DOCUMENTS_MENU_TITLE,
      className: 'documents',
      link: `/${languageCode}/app/documents`,
    },
    {
      title: ACTIVITY_HISTORY_MENU_TITLE,
      className: 'activity',
      link: `/${languageCode}/app/activity`,
    },
    {
      title: PRODUCTS_MENU_TITLE,
      className: 'product',
      link: `/${languageCode}/app/product/product-categories`,
    },
    {
      title: SETTINGS_MENU_TITLE,
      className: 'settings',
      link: `/${languageCode}/app/styles`,
      // Old pages, are not neccessary now
      // children: [
      // {
      //   title: 'Styles',
      //   className: 'styles',
      //   link: `/${languageCode}/app/styles`,
      // },
      // {
      //   title: 'Measurements',
      //   className: 'measurements',
      //   link: `/${languageCode}/app/measurements`,
      // },
      // {
      //   title: 'Delivery timeline',
      //   className: 'timeline',
      //   link: `/${languageCode}/app/timeline`,
      // },
      // ],
    },
    {
      title: REPORTS_MENU_TITLE,
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
          }`}
        >
          <NavLink
            onClick={() => {
              item.children ? setIsOpenSubMenu(true) : onMenuClick(item);
            }}
            className={`menu__link ${item.className}`}
            to={item.link}
            activeClassName={!item.children ? 'active' : ''}
          >
            {item.title}
          </NavLink>

          {item.children && isOpenSubMenu
            ? renderList(item.children, true)
            : null}
        </li>
      ))}
    </ul>
  );

  const resolveMenu = () => {
    const rolesList = new List(TokenHelper.extractRolesFromJWT());

    let resolvedMenu: IMenuItem[] = [];

    if (rolesList.contains(RoleType[RoleType.Administrator])) {
      resolvedMenu = new List(menu)
        .where((menuItem) => menuItem.title !== ORDER_PROFILES_MENU_TITLE)
        .toArray();
    } else if (rolesList.contains(RoleType[RoleType.Manufacturer])) {
      resolvedMenu = new List(menu)
        .where((menuItem) => menuItem.title !== ORDER_PROFILES_MENU_TITLE)
        .toArray();
    } else if (rolesList.contains(RoleType[RoleType.Customer])) {
    } else if (rolesList.contains(RoleType[RoleType.Dealer])) {
      resolvedMenu = new List(menu)
        .where(
          (menuItem) =>
            menuItem.title !== REPORTS_MENU_TITLE &&
            menuItem.title !== PRODUCTS_MENU_TITLE &&
            menuItem.title !== DEALERS_MENU_TITLE
        )
        .toArray();
    } else {
    }

    return resolvedMenu;
  };

  return <div className="menu">{renderList(resolveMenu())}</div>;
};

export default Menu;
