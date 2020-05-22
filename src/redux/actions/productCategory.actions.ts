import { createAction } from '@reduxjs/toolkit';
import * as types from '../constants/productCategory.types.constants';
import { ProductCategory } from '../../interfaces/index';

export const getAllProductCategory = createAction(
  types.API_GET_ALL_PRODUCT_CATEGORY
);

export const successGetAllProductCategory = createAction<ProductCategory[]>(
  types.SUCCESS_GET_ALL_PRODUCT_CATEGORY
);
// TODO add type
export const addNewProductCategory = createAction<any>(
  types.API_ADD_NEW_PRODUCT_CATEGORY
);

export const deleteProductCategory = createAction<number>(
  types.API_DELETE_PRODUCT_CATEGORY
);
