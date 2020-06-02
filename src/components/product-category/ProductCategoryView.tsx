import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Measurements from './measurements/Measurements';
import ProductCategories from './ProductCategories';
import ProductDeliverTimeline from './delivery-timeline/ProductDeliverTimeline';

const ProductCategoryView: React.FC = () => {
  return (
    <div>
      <Switch>
        <Route path={`/en/app/product/measurements`} component={Measurements} />
        <Route
          path={`/en/app/product/product-categories`}
          component={ProductCategories}
        />
        <Route
          path={`/en/app/product/delivery-timeline`}
          component={ProductDeliverTimeline}
        />
      </Switch>
    </div>
  );
};

export default ProductCategoryView;
