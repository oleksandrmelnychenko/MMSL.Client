import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import * as controlActions from '../../../redux/actions/control.actions';
import './menu.scss';
import { IApplicationState } from '../../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import { ToggleDealerPanelWithDetails } from '../../../redux/reducers/dealer.reducer';

interface IMenuItem {
  title: string;
  className: string;
  link: string;
}

const Menu: React.FC = () => {
  const dispatch = useDispatch();
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const languageCode = getActiveLanguage(localize).code;

  const foo = () => {
    dispatch(dealerActions.setSelectedDealer(null));
    dispatch(controlActions.isOpenPanelInfo(false));
    dispatch(controlActions.isCollapseMenu(false));
    dispatch(
      dealerActions.isOpenPanelWithDealerDetails(
        new ToggleDealerPanelWithDetails()
      )
    );
  };

  const menuItem: IMenuItem[] = [
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
      title: ' Activity History',
      className: 'activity',
      link: `/${languageCode}/app/activity`,
    },
    {
      title: 'Product Category',
      className: 'product',
      link: `/${languageCode}/app/product`,
    },
    {
      title: 'Reports',
      className: 'reports',
      link: `/${languageCode}/app/reports`,
    },
  ];

  return (
    <div className="menu">
      <ul className="menu__list">
        {menuItem.map((item) => (
          <li className="menu__item">
            <NavLink
              className={`menu__link ${item.className}`}
              to={item.link}
              activeClassName="active">
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
