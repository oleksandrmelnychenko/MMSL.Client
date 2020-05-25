import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/productCategory.actions';
import { ProductCategory, ChooseOptions, OptionGroup } from '../../interfaces';

export class ProductState {
  constructor() {
    this.productCategory = [];
    this.productManagementPanelState = new ProductManagementPanelState();
    this.choose = new ChooseOptions();
    this.manageSingleProductState = new ManageSingleProductState();
    this.productCategoryDetailsManagingState = new ProductCategoryDetailsManagingState();
  }

  productCategory: ProductCategory[];
  choose: ChooseOptions;
  productManagementPanelState: ProductManagementPanelState;
  manageSingleProductState: ManageSingleProductState;
  productCategoryDetailsManagingState: ProductCategoryDetailsManagingState;
}

export enum ProductManagingPanelComponent {
  Unknown,
  ProductManaging,
  ProductCategoryDetails,
  ProductMeasurement,
  ProductTimeLine,
  EditSingleProduct,
}

export class ProductManagementPanelState {
  constructor() {
    this.panelContent = null;
  }

  panelContent: ProductManagingPanelComponent | null;
}

export class ManageSingleProductState {
  constructor() {
    this.targetProductCategory = null;
  }

  targetProductCategory: ProductCategory | null;
}

export class ProductCategoryDetailsManagingState {
  constructor() {
    this.allOptionGroups = [];
  }

  allOptionGroups: OptionGroup[];
}

export const productReducer = createReducer(new ProductState(), (builder) =>
  builder
    .addCase(actions.successGetAllProductCategory, (state, action) => {
      state.productCategory = action.payload;
    })
    .addCase(actions.changeManagingPanelContent, (state, action) => {
      state.productManagementPanelState.panelContent = action.payload;
    })
    .addCase(actions.changeTargetSingeleManagingProduct, (state, action) => {
      state.manageSingleProductState.targetProductCategory = action.payload;
    })
    .addCase(actions.chooseProductCategory, (state, action) => {
      state.choose.category = action.payload;
    })
    .addCase(actions.updateOptiongroupsList, (state, action) => {
      state.productCategoryDetailsManagingState.allOptionGroups =
        action.payload;
    })
);
