import React, { useState, useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';

import * as productCategoryAction from '../../../redux/actions/productCategory.actions';
import { ToggleDealerPanelWithDetails } from '../../../redux/reducers/dealer.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductManagingPanelComponent } from '../../../redux/reducers/productCategory.reducer';
import { PanelInfo } from '../../../redux/reducers/control.reducer';

export interface IProductMenuItem {
  title: string;
  className: string;
  componentType: ProductManagingPanelComponent;
  isSelected?: boolean;
}

const ProductManagementPanel: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(productCategoryAction.chooseProductCategory(null));
    };
  }, []);

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Details',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductManaging,
      isSelected: false,
    },
    {
      title: 'Measurements',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductMeasurement,
      isSelected: false,
    },
    {
      title: 'Timeline',
      className: 'management__btn-detail',
      componentType: ProductManagingPanelComponent.ProductTimeLine,
      isSelected: false,
    },
  ];

  const [menu, setMenu] = useState(menuItem);
  const changeSelectedMenuItem = (componentType: number) => {
    const updateMenu = menu.map((item) => {
      item.isSelected = false;
      if (item.componentType === componentType) {
        item.isSelected = true;
      }
      return item;
    });

    setMenu(updateMenu);
  };

  return (
    <div className="management">
      {menu.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={false ? 'selected' : ''}>
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {}}
            allowDisabledFocus
          />
          {item.title}
        </Label>
      ))}
    </div>
  );
};

export default ProductManagementPanel;
