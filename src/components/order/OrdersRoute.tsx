import React from 'react';
import { Switch, Route } from 'react-router-dom';
import * as orderPaths from '../../common/environment/appPaths/order';
import OrderList from './orders/OrderList';
import NewMTMOrderBootstrapper from './details/management/mtm/NewMTMOrderBootstrapper';

export const OrdersRoute: React.FC = (props: any) => {
  return (
    <Switch>
      <Route
        path={orderPaths.APP_ORDER_NEW_MTM_ORDER}
        component={NewMTMOrderBootstrapper}
      />
      <Route path={orderPaths.APP_ORDER_LIST} component={OrderList} />
    </Switch>
  );
};

export default OrdersRoute;
