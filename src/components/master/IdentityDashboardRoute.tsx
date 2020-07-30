import React from 'react';
import './dashboard.scss';
import { Switch, Route } from 'react-router-dom';
import DealersBootstrapper from '../dealers/DealersBootstrapper';
import CustomersBootstrapper from '../customers/CustomersBootstrapper';
import FabricsViewBootstrapper from '../fabrics/FabricsBootstrapper';
import OrdersRoute from '../order/OrdersRoute';
import Reports from '../reports/Reports';
import ProductCategoryView from '../product-category/ProductCategoryView';
import { List } from 'linq-typescript';
import { TokenHelper } from '../../helpers/token.helper';
import { RoleType } from '../../interfaces/identity';
import * as appPaths from '../../common/environment/appPaths/index';
import * as productPaths from '../../common/environment/appPaths/product';
import * as orderPaths from '../../common/environment/appPaths/order';

const DEALERS_ROUTE: string = 'Dealers';
const CUSTOMER_ROUTE: string = 'Customer';
const PRODUCT_ROUTE: string = 'Product';
const REPORTS_ROUTE: string = 'Reports';
const ORDER_ROUTE: string = 'Order';
const STORE_ROUTE: string = 'Store';

const _routes: any[] = [
  {
    description: DEALERS_ROUTE,
  },
  {
    description: CUSTOMER_ROUTE,
  },
  {
    description: PRODUCT_ROUTE,
  },
  {
    description: REPORTS_ROUTE,
  },
  {
    description: ORDER_ROUTE,
  },
  {
    description: STORE_ROUTE,
  },
];

const IdentityDashboardRoute: React.FC = () => {
  const onRenderRoute = (routeDescription: string, index: number) => {
    if (routeDescription === DEALERS_ROUTE)
      return (
        <Route
          key={index}
          path={appPaths.APP_DEALERS}
          component={DealersBootstrapper}
        />
      );
    else if (routeDescription === CUSTOMER_ROUTE)
      return (
        <Route
          key={index}
          path={appPaths.APP_CUSTOMERS}
          component={CustomersBootstrapper}
        />
      );
    else if (routeDescription === PRODUCT_ROUTE)
      return (
        <Route
          key={index}
          path={productPaths.APP_PRODUCT}
          component={ProductCategoryView}
        />
      );
    else if (routeDescription === REPORTS_ROUTE)
      return (
        <Route key={index} path={appPaths.APP_REPORTS} component={Reports} />
      );
    else if (routeDescription === ORDER_ROUTE)
      return (
        <Route
          key={index}
          path={orderPaths.APP_ORDER}
          component={OrdersRoute}
        />
      );
    else if (routeDescription === STORE_ROUTE)
      return (
        <Route
          key={index}
          path={appPaths.APP_STORE}
          component={FabricsViewBootstrapper}
        />
      );
  };

  const rolesList = new List(TokenHelper.extractRolesFromJWT());

  let resolvedRoutes: any[] = [];

  if (rolesList.contains(RoleType[RoleType.Administrator])) {
    resolvedRoutes = new List(_routes)
      .where((route) => route.description !== ORDER_ROUTE)
      .toArray();
  } else if (rolesList.contains(RoleType[RoleType.Manufacturer])) {
    resolvedRoutes = new List(_routes)
      .where((route) => route.description !== ORDER_ROUTE)
      .toArray();
  } else if (rolesList.contains(RoleType[RoleType.Customer])) {
  } else if (rolesList.contains(RoleType[RoleType.Dealer])) {
    resolvedRoutes = new List(_routes)
      .where(
        (route) =>
          route.description !== REPORTS_ROUTE &&
          route.description !== PRODUCT_ROUTE &&
          route.description !== DEALERS_ROUTE
      )
      .toArray();
  }

  return (
    <Switch>
      {resolvedRoutes.map((route, index) => {
        return onRenderRoute(route.description, index);
      })}
    </Switch>
  );
};

export default IdentityDashboardRoute;
