import React, { useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
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
import ProductManagementPanel, {
  PRODUCT_MEASUREMENTS_PATH,
  PRODUCT_CATEGORIES_DASHBOARD_PATH,
  PRODUCT_TIMELINES_PATH,
  PRODUCT_STYLES_PATH,
  PRODUCT_STYLE_PERMISSIONS_PATH,
} from './options/ProductManagementPanel';
import ProductStylesPanel from './options/ProductStylesPanel';
import ProductPermissions from './productPermissions/ProductPermissions';
import ProductPermissionsPanel from './options/ProductPermissionsPanel';

const _extractCategoryIdFromPath = (history: any) => {
  const lastSegment: any = new List(
    history.location.pathname.split('/')
  ).lastOrDefault();

  return parseInt(lastSegment ? lastSegment : '');
};

const ProductCategoryView: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

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
    } else if (
      history?.location?.pathname?.includes(PRODUCT_STYLE_PERMISSIONS_PATH)
    ) {
      resolveTargetProductFlow(ProductPermissionsPanel);
    } else {
      if (targetCategory) {
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {
              dispatch(productActions.chooseProductCategory(null));
            },
          })
        );
      } else {
        dispatch(controlActions.closeInfoPanelWithComponent());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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
    } else {
      dispatch(
        controlActions.openInfoPanelWithComponent({
          component: optionsLeftPanelComponent,
          onDismisPendingAction: () => {
            history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
          },
        })
      );
    }
  };

  return (
    <div>
      <Switch>
        <Route
          path={`${PRODUCT_MEASUREMENTS_PATH}:productId`}
          component={Measurements}
        />
        <Route
          path={`${PRODUCT_TIMELINES_PATH}:productId`}
          component={ProductDeliverTimeline}
        />
        <Route
          path={`${PRODUCT_STYLES_PATH}:productId`}
          component={ProductSettings}
        />
        <Route
          path={`${PRODUCT_STYLE_PERMISSIONS_PATH}:productId`}
          component={ProductPermissions}
        />
        <Route
          path={PRODUCT_CATEGORIES_DASHBOARD_PATH}
          component={ProductCategories}
        />
      </Switch>
    </div>
  );
};

export default ProductCategoryView;
