import React from 'react';
import { Switch, Route } from 'react-router-dom';
import * as orderPaths from '../../common/environment/appPaths/order';
import OrderList from './orders/OrderList';
import NewMeetToMeasureOrder from './details/management/mtm/NewMeetToMeasureOrder';

export const OrdersRoute: React.FC = (props: any) => {
  return (
    <Switch>
      <Route path={orderPaths.APP_ORDER_LIST} component={OrderList} />
      <Route
        path={orderPaths.APP_ORDER_NEW_MTM_ORDER}
        component={NewMeetToMeasureOrder}
      />
    </Switch>
  );
};

export default OrdersRoute;
