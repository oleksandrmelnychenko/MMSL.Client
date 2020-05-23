import React, { useState, useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import * as productCategoryAction from '../../../redux/actions/productCategory.actions';
import { ToggleDealerPanelWithDetails } from '../../../redux/reducers/dealer.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductManagingPanelComponent } from '../../../redux/reducers/productCategory.reducer';
import { PanelInfo } from '../../../redux/reducers/control.reducer';
import { useHistory } from 'react-router-dom';

export interface IProductMenuItem {
  title: string;
  className: string;
  componentType: ProductManagingPanelComponent;
  onClickFunc?: Function;
}

const ProductManagementPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    return () => {
      dispatch(productCategoryAction.chooseProductCategory(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductCategoryDetails,
      isSelected: false,
    },
    {
      title: 'Measurements',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductMeasurement,
    },
    {
      title: 'Timeline',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductTimeLine,
    },
  ];

  const redirectToMeasurements = () => {
    history.push('/en/app/product/measurements');
  };

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={false ? 'selected' : ''}
        >
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
