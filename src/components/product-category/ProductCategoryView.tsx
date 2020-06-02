import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Measurements from './measurements/Measurements';
import ProductCategories from './ProductCategories';
import ProductDeliverTimeline from './delivery-timeline/ProductDeliverTimeline';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCategory } from '../../interfaces';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import { List } from 'linq-typescript';
import { productActions } from '../../redux/slices/product.slice';
import { controlActions } from '../../redux/slices/control.slice';
import ProductMeasurementPanel from './options/ProductMeasurementPanel';

const ProductCategoryView: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const targetCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    if (
      history.location &&
      history.location.pathname.includes('app/product/measurements/')
    ) {
      if (!targetCategory) {
        const lastSegment = new List(
          history.location.pathname.split('/')
        ).lastOrDefault();
        const categoryId: number = parseInt(lastSegment ? lastSegment : '');
        if (categoryId && !isNaN(categoryId)) {
          dispatch(
            assignPendingActions(
              productActions.apiGetProductCategoryById(categoryId),
              [],
              [],
              (args: any) => {
                dispatch(productActions.chooseProductCategory(args));
                dispatch(
                  controlActions.openInfoPanelWithComponent(
                    ProductMeasurementPanel
                  )
                );
              }
            )
          );
        }
      }
    }
  }, [targetCategory, history, dispatch]);

  return (
    <div>
      <Switch>
        <Route
          path={`/en/app/product/measurements/:productId`}
          component={Measurements}
        />
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
