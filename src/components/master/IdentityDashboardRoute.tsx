import React from 'react';
import './dashboard.scss';
import { Switch, Route } from 'react-router-dom';
import DealersBootstrapper from '../dealers/DealersBootstrapper';
import CustomersBootstrapper from '../customers/CustomersBootstrapper';
import Reports from '../reports/Reports';
import ProductCategoryView from '../product-category/ProductCategoryView';
import { List } from 'linq-typescript';
import { TokenHelper } from '../../helpers/token.helper';
import { RoleType } from '../../interfaces/identity';
import OrderProfileView from '../orderProfile/OrderProfileView';

const DEALERS_ROUTE: string = 'Dealers';
const CUSTOMER_ROUTE: string = 'Customer';
const PRODUCT_ROUTE: string = 'Product';
const REPORTS_ROUTE: string = 'Reports';
const ORDER_PROFILES_ROUTE: string = 'OrderProfiles';

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
    description: ORDER_PROFILES_ROUTE,
  },
];

const IdentityDashboardRoute: React.FC = () => {
  const onRenderRoute = (routeDescription: string, index: number) => {
    if (routeDescription === DEALERS_ROUTE)
      return (
        <Route
          key={index}
          path={`/en/app/dealers`}
          component={DealersBootstrapper}
        />
      );
    else if (routeDescription === CUSTOMER_ROUTE)
      return (
        <Route
          key={index}
          path={`/en/app/customers`}
          component={CustomersBootstrapper}
        />
      );
    else if (routeDescription === PRODUCT_ROUTE)
      return (
        <Route
          key={index}
          path={`/en/app/product`}
          component={ProductCategoryView}
        />
      );
    else if (routeDescription === REPORTS_ROUTE)
      return <Route key={index} path={`/en/app/reports`} component={Reports} />;
    else if (routeDescription === ORDER_PROFILES_ROUTE)
      return (
        <Route
          key={index}
          path={`/en/app/order-profiles`}
          component={OrderProfileView}
        />
      );
  };

  const rolesList = new List(TokenHelper.extractRolesFromJWT());

  let resolvedRoutes: any[] = [];

  if (rolesList.contains(RoleType[RoleType.Administrator])) {
    resolvedRoutes = new List(_routes)
      .where((route) => route.description !== ORDER_PROFILES_ROUTE)
      .toArray();
  } else if (rolesList.contains(RoleType[RoleType.Manufacturer])) {
    resolvedRoutes = new List(_routes)
      .where((route) => route.description !== ORDER_PROFILES_ROUTE)
      .toArray();
  } else if (rolesList.contains(RoleType[RoleType.Customer])) {
    debugger;
  } else if (rolesList.contains(RoleType[RoleType.Dealer])) {
    resolvedRoutes = new List(_routes)
      .where(
        (route) =>
          route.description !== REPORTS_ROUTE &&
          route.description !== PRODUCT_ROUTE &&
          route.description !== DEALERS_ROUTE
      )
      .toArray();
  } else {
    debugger;
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
