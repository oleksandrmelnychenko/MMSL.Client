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
import ProductTimelinesPanel from './options/ProductTimelinesPanel';
import ProductSettings from '../productSettings/ProductSettings';
import {
  PRODUCT_MEASUREMENTS_PATH,
  PRODUCT_CATEGORIES_DASHBOARD_PATH,
  PRODUCT_TIMELINES_PATH,
  PRODUCT_STYLES_PATH,
} from './options/ProductManagementPanel';
import ProductStylesPanel from './options/ProductStylesPanel';

const _extractCategoryIdFromPath = (history: any) => {
  const lastSegment: any = new List(
    history.location.pathname.split('/')
  ).lastOrDefault();

  return parseInt(lastSegment ? lastSegment : '');
};

const ProductCategoryView: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const targetCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    if (history?.location?.pathname?.includes(PRODUCT_MEASUREMENTS_PATH)) {
      resolveTargetProductFlow(ProductMeasurementPanel);
    } else if (history?.location?.pathname?.includes(PRODUCT_TIMELINES_PATH)) {
      resolveTargetProductFlow(ProductTimelinesPanel);
    } else if (history?.location?.pathname?.includes(PRODUCT_STYLES_PATH)) {
      resolveTargetProductFlow(ProductStylesPanel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveTargetProductFlow = (optionsLeftPanelComponent: any) => {
    if (!targetCategory) {
      const categoryId: number = _extractCategoryIdFromPath(history);

      if (categoryId && !isNaN(categoryId)) {
        dispatch(
          assignPendingActions(
            productActions.apiGetProductCategoryById(categoryId),
            [],
            [],
            (args: any) => {
              dispatch(productActions.chooseProductCategory(args));
              dispatch(
                controlActions.openInfoPanelWithComponent({
                  component: optionsLeftPanelComponent,
                  onDismisPendingAction: () => {
                    history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
                  },
                })
              );
            }
          )
        );
      }
    }
  };

  return (
    <div>
      <Switch>
        <Route
          path={`/en/app/product/measurements/:productId`}
          component={Measurements}
        />
        <Route
          path={`/en/app/product/delivery-timeline/:productId`}
          component={ProductDeliverTimeline}
        />
        <Route
          path={`/en/app/product/styles/:productId`}
          component={ProductSettings}
        />
        <Route
          path={`/en/app/product/product-categories`}
          component={ProductCategories}
        />
      </Switch>
    </div>
  );
};

export default ProductCategoryView;
