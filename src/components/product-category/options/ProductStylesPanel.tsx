import React, { useEffect } from 'react';
import { IInfoPanelMenuItem } from '../../../redux/slices/control.slice';
import { infoPanelActions } from '../../../redux/slices/infoPanel.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../../redux/slices/rightPanel.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import ProductManagementPanel from './ProductManagementPanel';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import ManagingvOptionGroupForm from '../productSettings/productSettingManagement/ManagingProductGroupForm';
import { RoleType } from '../../../interfaces/identity';
import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';

export const stylesPanelDismisActions = () => {
  return [
    productSettingsActions.updateSearchWordOptionGroup(''),
    productSettingsActions.updateOptionGroupList([]),
  ];
};

const ProductStylesPanel: React.FC = () => {
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
        history.push('/en/app/product/product-categories');

        /// Open product managing (common) panel
        dispatch(
          infoPanelActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {},
          })
        );

        stylesPanelDismisActions().forEach((action) => {
          dispatch(action);
        });
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'New',
      className: choseCategory
        ? 'management__btn-new_style'
        : 'management__btn-new_style management__btn-disabled',
      isDisabled: choseCategory ? false : true,
      tooltip: 'Create new product style',
      onClickFunc: () => {
        if (choseCategory) {
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'New style',
              width: '400px',
              panelType: RightPanelType.Form,
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
              },
              component: ManagingvOptionGroupForm,
            })
          );
        }
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default ProductStylesPanel;
