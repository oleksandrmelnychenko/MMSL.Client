import React from 'react';
import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import { Switch, useLocation, Route } from 'react-router-dom';
import DealersBootstrapper from '../dealers/DealersBootstrapper';
import Customers from '../customers/Customers';
import CommonDialog from './CommonDialog';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../redux/reducers/index';
import { Panel, PanelType } from 'office-ui-fabric-react';
import {
  RightPanelProps,
  DashboardHintStubProps,
} from '../../redux/slices/control.slice';
import { panelStyle } from '../../common/fabric-styles/styles';
import Reports from '../reports/Reports';
import ProductCategoryView from '../product-category/ProductCategoryView';
import { RightPanel } from './panel/RightPanel';
import DashboardLeftMenuPanel from './DashboardLeftMenuPanel';
import HintStub from './dashboardHint/HintStub';
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
    // route: <Route path={`/en/app/dealers`} component={DealersBootstrapper} />,
    description: DEALERS_ROUTE,
  },
  {
    // route: <Route path={`/en/app/customer`} component={Customers} />,
    description: CUSTOMER_ROUTE,
  },
  {
    // route: <Route path={`/en/app/product`} component={ProductCategoryView} />,
    description: PRODUCT_ROUTE,
  },
  {
    // route: <Route path={`/en/app/reports`} component={Reports} />,
    description: REPORTS_ROUTE,
  },
  {
    // route: (
    //   <Route path={`/en/app/order-profiles`} component={OrderProfileView} />
    // ),
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
      return <Route path={`/en/app/customer`} component={Customers} />;
    else if (routeDescription === PRODUCT_ROUTE)
      return <Route path={`/en/app/product`} component={ProductCategoryView} />;
    else if (routeDescription === REPORTS_ROUTE)
      return <Route path={`/en/app/reports`} component={Reports} />;
    else if (routeDescription === ORDER_PROFILES_ROUTE)
      return (
        <Route path={`/en/app/order-profiles`} component={OrderProfileView} />
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
