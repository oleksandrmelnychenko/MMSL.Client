import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import {
  controlActions,
  DashboardHintStubProps,
} from '../../../redux/slices/control.slice';
import { productActions } from '../../../redux/slices/product.slice';
import './menu.scss';
import { IApplicationState } from '../../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import { TokenHelper } from '../../../helpers/token.helper';
import { List } from 'linq-typescript';
import { RoleType } from '../../../interfaces/identity';
import * as appPaths from '../../../common/environment/appPaths/index';
import * as productPaths from '../../../common/environment/appPaths/product';
import * as orderPaths from '../../../common/environment/appPaths/order';

interface IMenuItem {
  title: string;
  className: string;
  link: string;
  children?: IMenuItem[];
}

const DASHBOARD_MENU_TITLE: string = 'Dashboard';
const ORDER_MENU_TITLE: string = 'Order';
const CUSTOMER_MENU_TITLE: string = 'Customer';
const DEALERS_MENU_TITLE: string = 'Dealers';
const STORE_MENU_TITLE: string = 'Store';
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

  const dashboardStubHint = useSelector<
    IApplicationState,
    DashboardHintStubProps
  >((state) => state.control.dashboardHintStub);

  const onMenuClick = (item: IMenuItem) => {
    setIsOpenSubMenu(false);
    dispatch(dealerActions.setSelectedDealer(null));
    dispatch(controlActions.closeInfoPanelWithComponent());
    dispatch(productSettingsActions.updateSearchWordOptionGroup(''));

    if (item.title !== PRODUCTS_MENU_TITLE) {
      dispatch(productActions.disposeProductCategoryStates());
    }
  };

  const menu: IMenuItem[] = [
    {
      title: DASHBOARD_MENU_TITLE,
      className: 'dashboard',
      link: `/${languageCode}/app/dashboard`,
    },
    {
      title: ORDER_MENU_TITLE,
      className: 'order',
      link: orderPaths.APP_ORDER_LIST,
    },
    {
      title: CUSTOMER_MENU_TITLE,
      className: 'customer',
      link: appPaths.APP_CUSTOMERS,
    },
    {
      title: DEALERS_MENU_TITLE,
      className: 'dealers',
      link: appPaths.APP_DEALERS,
    },
    {
      title: STORE_MENU_TITLE,
      className: 'store',
      link: appPaths.APP_STORE,
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
      link: productPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH,
    },
    {
      title: SETTINGS_MENU_TITLE,
      className: 'settings',
      link: `/${languageCode}/app/styles`,
    },
    {
      title: REPORTS_MENU_TITLE,
      className: 'reports',
      link: appPaths.APP_REPORTS,
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
              if (dashboardStubHint.isVisible)
                dispatch(controlActions.closeDashboardHintStub());

              onMenuClick(item);
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
        .where((menuItem) => menuItem.title !== ORDER_MENU_TITLE)
        .toArray();
    } else if (rolesList.contains(RoleType[RoleType.Manufacturer])) {
      resolvedMenu = new List(menu)
        .where((menuItem) => menuItem.title !== ORDER_MENU_TITLE)
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
