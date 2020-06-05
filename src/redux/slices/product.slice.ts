import { createSlice } from '@reduxjs/toolkit';
import {
  ProductCategory,
  OptionGroup,
  ChooseOptions,
  Measurement,
  MeasurementMapSize,
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
    this.measurementList = [];
    this.targetMeasurement = null;
    this.measurementForEdit = null;
    this.sizeForEdit = null;
  }

  measurementList: Measurement[];
  targetMeasurement: Measurement | null | undefined;
  measurementForEdit: Measurement | null | undefined;
  sizeForEdit: MeasurementMapSize | null | undefined;
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
    apiGetAllProductMeasurementsByProductId(
      state,
      action: { type: string; payload: number }
    ) {},
    updateProductMeasurementsList(
      state,
      action: { type: string; payload: Measurement[] }
    ) {
      state.productMeasurementsState.measurementList = action.payload;
    },
    changeSelectedProductMeasurement(
      state,
      action: { type: string; payload: Measurement | null | undefined }
    ) {
      state.productMeasurementsState.targetMeasurement = action.payload;
    },
    changeProductMeasurementForEdit(
      state,
      action: { type: string; payload: Measurement | null | undefined }
    ) {
      state.productMeasurementsState.measurementForEdit = action.payload;

      return state;
    },
    changeProductMeasurementSizeForEdit(
      state,
      action: { type: string; payload: MeasurementMapSize | null | undefined }
    ) {
      state.productMeasurementsState.sizeForEdit = action.payload;

      return state;
    },
    disposeProductCategoryStates(state) {
      state.productCategory = [];
      state.productManagementPanelState = new ProductManagementPanelState();
      state.choose = new ChooseOptions();
      state.manageSingleProductState = new ManageSingleProductState();
      state.productCategoryDetailsManagingState = new ProductCategoryDetailsManagingState();
      state.productMeasurementsState = new ProductMeasurementsState();
    },
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
