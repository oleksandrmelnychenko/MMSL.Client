import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as productCategoryAction from '../../redux/actions/productCategory.actions';

const ProductCategory: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(productCategoryAction.getAllProductCategory());
  }, []);

  return <div>PRODUCT-CATEGORY</div>;
};

export default ProductCategory;
