import { createAction } from '@reduxjs/toolkit';
import * as types from '../constants/productCategory.types.constants';
import { ProductCategory, OptionGroup } from '../../interfaces/index';
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

export const apiUpdateProductCategory = createAction<ProductCategory>(
  types.API_UPDATE_PRODUCT_CATEGORY
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

export const apiGetProductCategoryById = createAction<number>(
  types.API_GET_PRODUCT_CATEGORY_BY_ID
);

export const changeTargetSingeleManagingProduct = createAction<ProductCategory | null>(
  types.CHANGE_TARGET_SINGELE_MANAGING_PRODUCT
);

export const apiGetMeasurementsByProduct = createAction<number>(
  types.API_GET_MEASUREMENTS_BY_PRODUCT
);

export const successGetMeasurmentsByProduct = createAction<any>(
  types.SUCCESS_GET_MEASUREMENTS_BY_PRODUCT
);

export const setChooseProductCategoryId = createAction<number>(
  types.SET_CHOOSE_PRODUCT_CATEGORY_ID
);

export const updateOptiongroupsList = createAction<OptionGroup[]>(
  types.UPDATE_OPTIONGROUPS_LIST
);
