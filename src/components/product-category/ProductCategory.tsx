import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as productCategoryAction from '../../redux/actions/productCategory.actions';
import { ActionButton, Stack } from 'office-ui-fabric-react';
import CategoryManagementPanel from './categoryManagement/CategoryManagementPanel';
import * as productCategoryActions from '../../redux/actions/productCategory.actions';
import { ProductManagingPanelComponent } from '../../redux/reducers/productCategory.reducer';

const ProductCategory: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(productCategoryAction.getAllProductCategory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content__root">
      <div className="content__header">
        <div className="content__header__top">
          <Stack horizontal>
            <div className="content__header__top__title">Product Category</div>
            <div className="content__header__top__controls">
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <div className="content__header__top__controls__control">
                  <ActionButton
                    className="dealerAdd"
                    onClick={() => {
                      dispatch(
                        productCategoryActions.changeManagingPanelContent(
                          ProductManagingPanelComponent.ProductManaging
                        )
                      );
                    }}
                    iconProps={{ iconName: 'Add' }}
                  >
                    New Category
                  </ActionButton>
                </div>
              </Stack>
            </div>
          </Stack>
        </div>

        <CategoryManagementPanel />
      </div>
    </div>
  );
};

export default ProductCategory;
