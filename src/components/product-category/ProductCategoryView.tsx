import React, { useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import MeasurementsBootstrapper from './measurements/MeasurementsBootstrapper';
import ProductCategories from './ProductCategories';
import ProductDeliverTimeline from './delivery-timeline/ProductDeliverTimeline';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCategory } from '../../interfaces/products';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import { List } from 'linq-typescript';
import { productActions } from '../../redux/slices/product.slice';
import { infoPanelActions } from '../../redux/slices/infoPanel.slice';
import ProductMeasurementPanel from './options/measurementOptions/ProductMeasurementPanel';
import ProductTimelinesPanel from './options/ProductTimelinesPanel';
import ProductSettingsBootstrapper from './productSettings/ProductSettingsBootstrapper';
import ProductManagementPanel from './options/ProductManagementPanel';
import ProductStylesPanel from './options/ProductStylesPanel';
import ProductPermissions from './productPermissions/ProductPermissions';
import ProductPermissionsPanel from './options/ProductPermissionsPanel';
import { unitsActions } from '../../redux/slices/units.slice';
import * as productPaths from '../../common/environment/appPaths/product';

const PRODUCT_ID_PATH_SEGMENT: string = ':productId';

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
    dispatch(
      assignPendingActions(
        unitsActions.apiGetCurrencies(),
        [],
        [],
        (args: any) => {
          dispatch(unitsActions.changeCurrencies(args));
        },
        (args: any) => {}
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      history?.location?.pathname?.includes(
        productPaths.APP_PRODUCT_MEASUREMENTS
      )
    ) {
      resolveTargetProductFlow(ProductMeasurementPanel);
    } else if (
      history?.location?.pathname?.includes(productPaths.APP_PRODUCT_TIMELINES)
    ) {
      resolveTargetProductFlow(ProductTimelinesPanel);
    } else if (
      history?.location?.pathname?.includes(
        productPaths.APP_PRODUCT_STYLES_PATH
      )
    ) {
      resolveTargetProductFlow(ProductStylesPanel);
    } else if (
      history?.location?.pathname?.includes(
        productPaths.APP_PRODUCT_STYLE_PERMISSIONS
      )
    ) {
      resolveTargetProductFlow(ProductPermissionsPanel);
    } else {
      if (targetCategory) {
        dispatch(
          infoPanelActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {
              dispatch(productActions.chooseProductCategory(null));
            },
          })
        );
      } else {
        dispatch(infoPanelActions.closeInfoPanelWithComponent());
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
                infoPanelActions.openInfoPanelWithComponent({
                  component: optionsLeftPanelComponent,
                  onDismisPendingAction: () => {
                    history.push(
                      productPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH
                    );
                  },
                })
              );
            }
          )
        );
      }
    } else {
      dispatch(
        infoPanelActions.openInfoPanelWithComponent({
          component: optionsLeftPanelComponent,
          onDismisPendingAction: () => {
            history.push(productPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);
          },
        })
      );
    }
  };

  return (
    <div>
      <Switch>
        <Route
          path={`${productPaths.APP_PRODUCT_MEASUREMENTS}${PRODUCT_ID_PATH_SEGMENT}`}
          component={MeasurementsBootstrapper}
        />
        <Route
          path={`${productPaths.APP_PRODUCT_TIMELINES}${PRODUCT_ID_PATH_SEGMENT}`}
          component={ProductDeliverTimeline}
        />
        <Route
          path={`${productPaths.APP_PRODUCT_STYLES_PATH}${PRODUCT_ID_PATH_SEGMENT}`}
          component={ProductSettingsBootstrapper}
        />
        <Route
          path={`${productPaths.APP_PRODUCT_STYLE_PERMISSIONS}${PRODUCT_ID_PATH_SEGMENT}`}
          component={ProductPermissions}
        />
        <Route
          path={productPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH}
          component={ProductCategories}
        />
      </Switch>
    </div>
  );
};

export default ProductCategoryView;
