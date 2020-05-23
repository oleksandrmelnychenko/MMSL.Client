import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/productCategory.actions';
import { ProductCategory } from '../../interfaces';

export class ProductState {
  constructor() {
    this.productCategory = [];
    this.productManagementPanelState = new ProductManagementPanelState();
    this.chooseCategory = null;
  }
  productCategory: ProductCategory[];
  chooseCategory: ProductCategory | null;
  productManagementPanelState: ProductManagementPanelState;
}

export enum ProductManagingPanelComponent {
  Unknown,
  ProductManaging,
  ProductMeasurement,
  ProductTimeLine,
}

export class ProductManagementPanelState {
  constructor() {
    this.panelContent = null;
  }

  panelContent: ProductManagingPanelComponent | null;
}

export const productReducer = createReducer(new ProductState(), (builder) =>
  builder
    .addCase(actions.successGetAllProductCategory, (state, action) => {
      state.productCategory = action.payload;
    })
    .addCase(actions.changeManagingPanelContent, (state, action) => {
      state.productManagementPanelState.panelContent = action.payload;
    })
    .addCase(actions.chooseProductCategory, (state, action) => {
      state.chooseCategory = action.payload;
    })
);
