import React, { useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import * as productCategoryAction from '../../../redux/actions/productCategory.actions';
import { controlActions } from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { ProductManagingPanelComponent } from '../../../redux/reducers/productCategory.reducer';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces';

export interface IProductMenuItem {
  title: string;
  className: string;
  componentType: ProductManagingPanelComponent;
  onClickFunc?: Function;
}

const ProductManagementPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    return () => {
      // dispatch(productCategoryAction.chooseProductCategory(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductCategoryDetails,
    },
    {
      title: 'Measurements',
      className: 'management__btn-measurements',
      componentType: ProductManagingPanelComponent.ProductMeasurement,
    },
    {
      title: 'Timeline',
      className: 'management__btn-timeline',
      componentType: ProductManagingPanelComponent.ProductTimeLine,
    },
  ];

  const redirectToMeasurements = () => {
    dispatch(
      productCategoryAction.setChooseProductCategoryId(choseCategory!.id)
    );
    dispatch(controlActions.closeInfoPanelWithComponent());
    history.push('/en/app/product/measurements');
  };

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={false ? 'selected' : ''}>
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              if (
                item.componentType ===
                ProductManagingPanelComponent.ProductCategoryDetails
              ) {
                dispatch(
                  productCategoryAction.changeManagingPanelContent(
                    ProductManagingPanelComponent.ProductCategoryDetails
                  )
                );
              } else if (
                item.componentType ===
                ProductManagingPanelComponent.ProductMeasurement
              ) {
                redirectToMeasurements();
              }
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
