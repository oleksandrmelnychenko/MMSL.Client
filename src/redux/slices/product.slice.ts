import { createSlice } from '@reduxjs/toolkit';
import {
  ProductCategory,
  OptionGroup,
  ChooseOptions,
  Measurement,
} from '../../interfaces';

export class ProductState {
  constructor() {
    this.productCategory = [];
    this.productManagementPanelState = new ProductManagementPanelState();
    this.choose = new ChooseOptions();
    this.manageSingleProductState = new ManageSingleProductState();
    this.productCategoryDetailsManagingState = new ProductCategoryDetailsManagingState();
    this.productMeasurementsState = new ProductMeasurementsState();
  }

  productCategory: ProductCategory[];
  choose: ChooseOptions;
  productManagementPanelState: ProductManagementPanelState;
  manageSingleProductState: ManageSingleProductState;
  productCategoryDetailsManagingState: ProductCategoryDetailsManagingState;
  productMeasurementsState: ProductMeasurementsState;
}

export enum ProductManagingPanelComponent {
  Unknown,
  ProductManaging,
  ProductCategoryDetails,
  ProductMeasurement,
  ProductTimeLine,
  EditSingleProduct,
  MeasurementPanel,
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
    this.isDisabled = false;
  }

  isDisabled: boolean;
  allOptionGroups: OptionGroup[];
}

export class ProductMeasurementsState {
  constructor() {
    this.isMeasurementsWasRequested = false;
    this.measurementList = [];
    this.targetMeasurement = null;
    this.measurementForEdit = null;
  }

  isMeasurementsWasRequested: boolean;
  measurementList: Measurement[];
  targetMeasurement: Measurement | null | undefined;
  measurementForEdit: Measurement | null | undefined;
}

const product = createSlice({
  name: 'product',
  initialState: new ProductState(),
  reducers: {
    apiGetAllProductMeasurementsByProductId(
      state,
      action: { type: string; payload: number }
    ) {
      return state;
    },
    updateIsProductMeasurementsWasRequested(
      state,
      action: { type: string; payload: boolean }
    ) {
      state.productMeasurementsState.isMeasurementsWasRequested =
        action.payload;

      return state;
    },
    updateProductMeasurementsList(
      state,
      action: { type: string; payload: Measurement[] }
    ) {
      state.productMeasurementsState.measurementList = action.payload;

      return state;
    },
    changeSelectedProductMeasurement(
      state,
      action: { type: string; payload: Measurement | null | undefined }
    ) {
      state.productMeasurementsState.targetMeasurement = action.payload;

      return state;
    },
    changeProductMeasurementForEdit(
      state,
      action: { type: string; payload: Measurement | null | undefined }
    ) {
      state.productMeasurementsState.measurementForEdit = action.payload;

      return state;
    },
    disposeProductCategoryStates(state) {
      state.productCategory = [];
      state.productManagementPanelState = new ProductManagementPanelState();
      state.choose = new ChooseOptions();
      state.manageSingleProductState = new ManageSingleProductState();
      state.productCategoryDetailsManagingState = new ProductCategoryDetailsManagingState();
      state.productMeasurementsState = new ProductMeasurementsState();

      return state;
    },
    apiGetAllProductCategory(state) {
      return state;
    },
    apiAddNewProductCategory(state, action) {
      return state;
    },
    apiUpdateProductCategory(state, action) {
      return state;
    },
    apiDeleteProductCategory(state, action) {
      return state;
    },
    apiGetProductCategoryById(state, action) {
      return state;
    },
    apiGetMeasurementsByProduct(state, action) {
      return state;
    },
    apiSaveUpdatedProductGroups(state, action) {
      return state;
    },
    apiAddNewMeasurement(state, action) {
      return state;
    },
    successGetAllProductCategory(state, action) {
      state.productCategory = action.payload;
      return state;
    },
    changeManagingPanelContent(state, action) {
      state.productManagementPanelState.panelContent = action.payload;
      return state;
    },

    changeTargetSingeleManagingProduct(state, action) {
      state.manageSingleProductState.targetProductCategory = action.payload;
      return state;
    },
    chooseProductCategory(state, action) {
      state.choose.category = action.payload;
      return state;
    },
    setChooseProductCategoryId(state, action) {
      state.choose.categoryId = action.payload;
      return state;
    },
    successGetMeasurmentsByProduct(state, action) {
      state.choose.measurements = action.payload;
      return state;
    },
    updateOptiongroupsList(state, action) {
      state.productCategoryDetailsManagingState.allOptionGroups =
        action.payload;
      return state;
    },
    toggleIsDetailsformDisabled(state, action) {
      state.productCategoryDetailsManagingState.isDisabled = action.payload;
      return state;
    },
  },
});

export const productActions = product.actions;
export default product.reducer;
