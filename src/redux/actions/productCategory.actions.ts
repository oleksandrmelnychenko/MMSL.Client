import { createAction } from '@reduxjs/toolkit';
import * as types from '../constants/productCategory.types.constants';
import { ProductCategory } from '../../interfaces/index';
import { ProductManagingPanelComponent } from '../reducers/productCategory.reducer';

export const getAllProductCategory = createAction(
  types.GET_ALL_PRODUCT_CATEGORY
);

export const successGetAllProductCategory = createAction<ProductCategory[]>(
  types.SUCCESS_GET_ALL_PRODUCT_CATEGORY
);
// TODO add type
export const addNewProductCategory = createAction<any>(
  types.ADD_NEW_PRODUCT_CATEGORY
);
// TODO add type
// export const successGetAllProductCategory = createAction<ProductCategory[]>(
//   types.SUCCESS_GET_ALL_PRODUCT_CATEGORY
// );
export const changeManagingPanelContent = createAction<ProductManagingPanelComponent | null>(
  types.CHANGE_MANAGING_PANEL_CONTENT
);

export type ChangeManagingPanelContent = ReturnType<
  typeof changeManagingPanelContent
>;
