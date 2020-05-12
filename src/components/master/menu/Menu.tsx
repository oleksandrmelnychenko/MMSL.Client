import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import './menu.scss';
import { IApplicationState } from '../../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';

const Menu: React.FC = () => {
  const localize = useSelector<IApplicationState, LocalizeState>(
    (state) => state.localize
  );
  const languageCode = getActiveLanguage(localize).code;

  return (
    <div className="menu">
      <ul className="menu__list">
        <li className="menu__item">
          <NavLink
            className="menu__link dashboard"
            to={`/${languageCode}/app/dashboard`}
            activeClassName="active">
            Dashboard
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link order"
            to={`/${languageCode}/app/order`}
            activeClassName="active">
            Order
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link customer"
            to={`/${languageCode}/app/customer`}
            activeClassName="active">
            Customer
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link dealers"
            to={`/${languageCode}/app/dealers`}
            activeClassName="active">
            Dealers
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link stock"
            to={`/${languageCode}/app/stock`}
            activeClassName="active">
            Stock
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link documents"
            to={`/${languageCode}/app/documents`}
            activeClassName="active">
            Documents
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link activity"
            to={`/${languageCode}/app/activity`}
            activeClassName="active">
            Activity History
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link product"
            to={`/${languageCode}/app/product`}
            activeClassName="active">
            Product Category
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__link reports"
            to={`/${languageCode}/app/reports`}
            activeClassName="active">
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
