import React from 'react';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import ProductMeasurementPanel, {
  measurementsPanelDismisActions,
} from './measurementOptions/ProductMeasurementPanel';
import ProductTimelinesPanel from './ProductTimelinesPanel';
import ProductStylesPanel, {
  stylesPanelDismisActions,
} from './ProductStylesPanel';
import ProductPermissionsPanel, {
  permissionsPanelDismisActions,
} from './ProductPermissionsPanel';
import { RoleType } from '../../../interfaces/identity';
import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';
import * as appPaths from '../../../common/environment/appPaths/index';

const ProductManagementPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const menuItem: IInfoPanelMenuItem[] = [
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Styles',
      className: 'management__btn-styles',
      isDisabled: choseCategory ? false : true,
      tooltip: '',
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductStylesPanel,
            onDismisPendingAction: () => {
              history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);

              stylesPanelDismisActions().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (choseCategory) {
          history.push(
            `${appPaths.APP_PRODUCT_STYLES_PATH}${choseCategory.id}`
          );
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Measurements',
      className: 'management__btn-measurements',
      isDisabled: choseCategory ? false : true,
      tooltip: '',
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductMeasurementPanel,
            onDismisPendingAction: () => {
              history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);

              measurementsPanelDismisActions().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (choseCategory) {
          history.push(
            `${appPaths.APP_PRODUCT_MEASUREMENTS}${choseCategory.id}`
          );
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Timeline',
      className: 'management__btn-timeline',
      isDisabled: choseCategory ? false : true,
      tooltip: '',
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductTimelinesPanel,
            onDismisPendingAction: () => {
              history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);
            },
          })
        );

        if (choseCategory) {
          history.push(`${appPaths.APP_PRODUCT_TIMELINES}${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Style Permissions',
      className: 'management__btn-style_permissions',
      isDisabled: choseCategory ? false : true,
      tooltip: '',
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductPermissionsPanel,
            onDismisPendingAction: () => {
              history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);

              permissionsPanelDismisActions().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (choseCategory) {
          history.push(
            `${appPaths.APP_PRODUCT_STYLE_PERMISSIONS}${choseCategory.id}`
          );
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default ProductManagementPanel;
