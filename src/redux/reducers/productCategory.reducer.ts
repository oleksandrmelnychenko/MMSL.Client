import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/productCategory.actions';
import { ProductCategory } from '../../interfaces';

export class ProductState {
  constructor() {
    this.productCategory = [];
    this.productManagementPanelState = new ProductManagementPanelState();
  }
  productCategory: ProductCategory[];

  productManagementPanelState: ProductManagementPanelState;
}

export enum ProductManagingPanelComponent {
  Unknown,
  ProductManaging,
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
);
