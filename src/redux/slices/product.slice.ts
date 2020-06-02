import { createSlice } from '@reduxjs/toolkit';
import { ProductCategory, OptionGroup, ChooseOptions } from '../../interfaces';

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

const product = createSlice({
  name: 'product',
  initialState: new ProductState(),
  reducers: {
    apiGetAllProductCategory(state) {},
    apiAddNewProductCategory(state, action) {},
    apiUpdateProductCategory(state, action) {},
    apiDeleteProductCategory(state, action) {},
    apiGetProductCategoryById(state, action) {},
    apiGetMeasurementsByProduct(state, action) {},
    apiSaveUpdatedProductGroups(state, action) {},
    apiAddNewMeasurement(state, action) {},
    successGetAllProductCategory(state, action) {
      state.productCategory = action.payload;
    },
    changeManagingPanelContent(state, action) {
      state.productManagementPanelState.panelContent = action.payload;
    },
    selectedTimeline(state, action) {
      state.choose.selectedTimeline = action.payload;
    },
    changeTargetSingeleManagingProduct(state, action) {
      state.manageSingleProductState.targetProductCategory = action.payload;
    },
    chooseProductCategory(state, action) {
      state.choose.category = action.payload;
    },
    setChooseProductCategoryId(state, action) {
      state.choose.categoryId = action.payload;
    },
    successGetMeasurmentsByProduct(state, action) {
      state.choose.measurements = action.payload;
    },
    updateOptiongroupsList(state, action) {
      state.productCategoryDetailsManagingState.allOptionGroups =
        action.payload;
    },
    toggleIsDetailsformDisabled(state, action) {
      state.productCategoryDetailsManagingState.isDisabled = action.payload;
    },
    assignProductDeliveryTimeline(state, action) {},
    apiProductDeliveryTimelineByProduct(state, action) {},
  },
});

export const productActions = product.actions;
export default product.reducer;
