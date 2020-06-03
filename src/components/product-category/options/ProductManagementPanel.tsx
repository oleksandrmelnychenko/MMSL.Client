import React, { useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import { productActions } from '../../../redux/slices/product.slice';
import { controlActions } from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { ProductManagingPanelComponent } from '../../../redux/slices/product.slice';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces';
import ProductMeasurementPanel from './ProductMeasurementPanel';
import ProductTimelinesPanel from './ProductTimelinesPanel';

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
      title: 'Details',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductCategoryDetails,
      isDisabled: choseCategory ? false : true,
      onClickFunc: () => {
        dispatch(
          productActions.changeManagingPanelContent(
            ProductManagingPanelComponent.ProductCategoryDetails
          )
        );
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
              history.push('/en/app/product/product-categories');
            },
          })
        );

        if (choseCategory) {
          history.push(`/en/app/product/measurements/${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(`/en/app/product`);
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
              history.push('/en/app/product/product-categories');
            },
          })
        );

        if (choseCategory) {
          history.push(`/en/app/product/delivery-timeline/${choseCategory.id}`);
        } else {
          dispatch(controlActions.closeInfoPanelWithComponent());
          history.push(`/en/app/product`);
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
