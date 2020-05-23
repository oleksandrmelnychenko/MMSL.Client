import React from 'react';
import { Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Measurements from './measurements/Measurements';
import ProductCategories from './ProductCategories';

const ProductCategoryView: React.FC = () => {
  return (
    <div>
      <Switch>
        <PrivateRoute
          path={`/en/app/product/measurements`}
          component={Measurements}
        />
        <PrivateRoute
          path={`/en/app/product/product-categories`}
          component={ProductCategories}
        />
      </Switch>
    </div>
  );
};

export default ProductCategoryView;
