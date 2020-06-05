import React, { useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import { controlActions } from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { ProductManagingPanelComponent } from '../../../redux/slices/product.slice';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces';
import ProductMeasurementPanel, {
  measurementsPanelDismisActions,
} from './ProductMeasurementPanel';
import ProductTimelinesPanel from './ProductTimelinesPanel';
import ProductStylesPanel, {
  stylesPanelDismisActions,
} from './ProductStylesPanel';
import ProductPermissionsPanel, {
  permissionsPanelDismisActions,
} from './ProductPermissionsPanel';

export const PRODUCT_CATEGORIES_DASHBOARD_PATH: string =
  '/en/app/product/product-categories';
export const PRODUCT_STYLES_PATH: string = '/en/app/product/styles/';
export const PRODUCT_MEASUREMENTS_PATH: string =
  '/en/app/product/measurements/';
export const PRODUCT_TIMELINES_PATH: string =
  '/en/app/product/delivery-timeline/';
export const PRODUCT_STYLE_PERMISSIONS_PATH: string =
  '/en/app/product/style-permissions/';

export interface IProductMenuItem {
  title: string;
  className: string;
  componentType: ProductManagingPanelComponent;
  onClickFunc: Function;
  isDisabled: boolean;
}

const ProductManagementPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    return () => {};
  }, []);

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Styles',
      className: 'management__btn-styles',
      componentType: ProductManagingPanelComponent.ProductCategoryDetails,
      isDisabled: choseCategory ? false : true,
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductStylesPanel,
            onDismisPendingAction: () => {
              history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);

              stylesPanelDismisActions().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (choseCategory) {
          history.push(`${PRODUCT_STYLES_PATH}${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
    {
      title: 'Measurements',
      className: 'management__btn-measurements',
      componentType: ProductManagingPanelComponent.ProductMeasurement,
      isDisabled: choseCategory ? false : true,
      onClickFunc: () => {
        // dispatch(productActions.setChooseProductCategoryId(choseCategory!.id));
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductMeasurementPanel,
            onDismisPendingAction: () => {
              history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);

              measurementsPanelDismisActions().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (choseCategory) {
          history.push(`${PRODUCT_MEASUREMENTS_PATH}${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
    {
      title: 'Timeline',
      className: 'management__btn-timeline',
      componentType: ProductManagingPanelComponent.ProductTimeLine,
      isDisabled: choseCategory ? false : true,
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductTimelinesPanel,
            onDismisPendingAction: () => {
              history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
            },
          })
        );

        if (choseCategory) {
          history.push(`${PRODUCT_TIMELINES_PATH}${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
    {
      title: 'Style Permissions',
      className: 'management__btn-styles',
      componentType: ProductManagingPanelComponent.StylePermissions,
      isDisabled: choseCategory ? false : true,
      onClickFunc: () => {
        dispatch(controlActions.closeInfoPanelWithComponent());
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductPermissionsPanel,
            onDismisPendingAction: () => {
              history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);

              permissionsPanelDismisActions().forEach((action) => {
                dispatch(action);
              });
            },
          })
        );

        if (choseCategory) {
          history.push(`${PRODUCT_STYLE_PERMISSIONS_PATH}${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);
        }
      },
    },
  ];

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={false ? 'selected' : ''}
        >
          <PrimaryButton
            disabled={item.isDisabled}
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              item.onClickFunc();
            }}
            allowDisabledFocus
          />
          {item.title}
        </Label>
      ))}
    </div>
  );
};

export default ProductManagementPanel;
