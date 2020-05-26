import React, { useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import * as productCategoryAction from '../../../redux/actions/productCategory.actions';
import { controlActions } from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { ProductManagingPanelComponent } from '../../../redux/reducers/productCategory.reducer';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces';

export interface IProductMenuItem {
  title: string;
  className: string;
  componentType: ProductManagingPanelComponent;
  onClickFunc?: Function;
}

const MeasurementsPanel: React.FC = () => {
  const dispatch = useDispatch();

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
      componentType: ProductManagingPanelComponent.MeasurementPanel,
    },
  ];

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label key={index} styles={labelStyle}>
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              dispatch(
                productCategoryAction.changeManagingPanelContent(
                  ProductManagingPanelComponent.ProductCategoryDetails
                )
              );
            }}
            allowDisabledFocus
          />
          {item.title}
        </Label>
      ))}
    </div>
  );
};

export default MeasurementsPanel;
