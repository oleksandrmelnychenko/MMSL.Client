import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as productCategoryAction from '../../redux/actions/productCategory.actions';
import { ActionButton, Stack } from 'office-ui-fabric-react';

const ProductCategory: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(productCategoryAction.getAllProductCategory());
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
                    onClick={() => {}}
                    iconProps={{ iconName: 'Add' }}>
                    New Category
                  </ActionButton>
                </div>
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
