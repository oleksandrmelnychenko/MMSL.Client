import { createAction } from '@reduxjs/toolkit';
import * as types from '../constants/productCategory.types.constants';
import { ProductCategory } from '../../interfaces/index';
import { ProductManagingPanelComponent } from '../reducers/productCategory.reducer';

export const apiGetAllProductCategory = createAction(
  types.API_GET_ALL_PRODUCT_CATEGORY
);

export const successGetAllProductCategory = createAction<ProductCategory[]>(
  types.SUCCESS_GET_ALL_PRODUCT_CATEGORY
);

export const apiAddNewProductCategory = createAction<ProductCategory>(
  types.API_ADD_NEW_PRODUCT_CATEGORY
);

export const apiDeleteProductCategory = createAction<number>(
  types.API_DELETE_PRODUCT_CATEGORY
);

export const changeManagingPanelContent = createAction<ProductManagingPanelComponent | null>(
  types.CHANGE_MANAGING_PANEL_CONTENT
);

export const chooseProductCategory = createAction<ProductCategory | null>(
  types.CHOOSE_PRODUCT_CATEGORY
);
