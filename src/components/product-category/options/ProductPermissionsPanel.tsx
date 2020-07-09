import React, { useEffect } from 'react';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import ProductManagementPanel from './ProductManagementPanel';
import ProductPermissionForm from '../productPermissions/managing/ProductPermissionForm';
import { RoleType } from '../../../interfaces/identity';
import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';
import * as appPaths from '../../../common/environment/appPaths/index';

export const permissionsPanelDismisActions = () => {
  return [];
};

const ProductPermissionsPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    return () => {};
  }, []);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Back',
      className: 'management__btn-back_measurement',
      isDisabled: false,
      tooltip: 'Go back to products',
      onClickFunc: () => {
        history.push(appPaths.APP_PRODUCT_CATEGORIES_DASHBOARD_PATH);

        /// Open product managing (common) panel
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {},
          })
        );

        permissionsPanelDismisActions().forEach((action) => {
          dispatch(action);
        });
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'New',
      className: choseCategory
        ? 'management__btn-style_add_permissions'
        : 'management__btn-style_add_permissions management__btn-disabled',
      isDisabled: choseCategory ? false : true,
      tooltip: 'Create new product style permission',
      onClickFunc: () => {
        if (choseCategory) {
          dispatch(
            controlActions.openRightPanel({
              title: 'New style permission',
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
              },
              component: ProductPermissionForm,
            })
          );
        }
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default ProductPermissionsPanel;
