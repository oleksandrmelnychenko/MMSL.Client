import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/productCategory.actions';
import { ProductCategory } from '../../interfaces';

export class ProductState {
  constructor() {
    this.productCategory = [];
  }
  productCategory: ProductCategory[];
}

export const productReducer = createReducer(new ProductState(), (builder) =>
  builder.addCase(actions.successGetAllProductCategory, (state, action) => {
    state.productCategory = action.payload;
  })
);
