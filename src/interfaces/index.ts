import { GroupItemVisualState } from './viewModels/index';
import { CommonDialogState } from '../redux/slices/control.slice';
import { DealerDetilsComponents } from '../redux/slices/dealer.slice';

export interface IUserInfo {
  userIdentityId: number;
  companyInfoId: number;
  userAccountType: number;
  userIdentity?: any;
  id: string;
  isDeleted?: boolean;
  created?: Date;
  lastModified?: Date;
}

export interface IAuthentication {
  email: string;
  password: string;
}

export interface IFailureAuth {
  isError: boolean;
  errorMessage: string;
}

export interface IAuthState {
  isAuth: boolean;
  errorMessage: string;
  isError: boolean;
}

export interface IPanelInfo {
  isOpenPanelInfo: boolean;
  componentInPanelInfo: any;
}

export interface IControlState {
  isGlobalShimmerActive: boolean;
  isCollapseMenu: boolean;
  panelInfo: IPanelInfo;
  commonDialog: CommonDialogState;
  infoMessage: string;
  isActivateStatusBar: boolean;
  isMasterBusy: boolean;
}

export class EntityBase {
  constructor() {
    this.id = 0;
    this.isDeleted = false;
  }

  id: number;
  isDeleted: boolean;
}

export interface ImenuItem {
  title: string;
  className: string;
  componentType: DealerDetilsComponents;
  isSelected?: boolean;
}

export class EntityBaseNamed extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

export interface IStore {
  address: Address;
  addressId?: number;
  billingEmail: string;
  contactEmail: string;
  description?: string;
  id?: number;
  isDeleted?: boolean;
  name: string;
  storeCustomersCount?: number;
}

export interface INewStore {
  name: string;
  dealerAccountId: number | null;
  addressId?: number;
  address: IAddress;
  billingEmail: string;
  contactEmail: string;
}

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export enum Currency {
  USD = 2,
  EUR = 1,
}

export enum PaymentType {
  BankTransfer = 2,
  Cash = 1,
}

export class CurrencyF extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

export class PaymentTypeF extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

export class DealerAccount extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.companyName = '';
    this.email = '';
    this.alternateEmail = '';
    this.phoneNumber = '';
    this.taxNumber = '';
    this.isVatApplicable = false;
    this.currencyTypeId = 0;
    this.paymentTypeId = 0;
    this.isCreditAllowed = false;
    this.billingAddressId = null;
    this.billingAddress = null;
    this.useBillingAsShipping = false;
    this.shippingAddressId = null;
    this.shippingAddress = null;
    this.stores = [];
  }

  name: string;
  companyName: string;
  email: string;
  alternateEmail: string;
  phoneNumber: string;
  taxNumber: string;
  isVatApplicable: boolean;
  currencyTypeId: number;
  paymentTypeId: number;
  isCreditAllowed: boolean;
  billingAddressId: number | null;
  billingAddress: Address | null;
  useBillingAsShipping: boolean;
  shippingAddressId: number | null;
  shippingAddress: Address | null;
  stores: any[];
}

export class Address extends EntityBase {
  constructor() {
    super();

    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.zipCode = '';
  }

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class Pagination {
  constructor() {
    this.limit = 99;
    this.paginationInfo = new PaginationInfo();
    this.paginationInfo.pageNumber = 1;
  }

  limit: number;
  paginationInfo: PaginationInfo;
}

export class PaginationInfo {
  constructor() {
    this.totalItems = 0;
    this.pageSize = 0;
    this.pageNumber = 0;
    this.pagesCount = 0;
  }

  totalItems: number;
  pageSize: number;
  pageNumber: number;
  pagesCount: number;
}

export class StoreCustomer extends EntityBase {
  constructor() {
    super();
    this.userName = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
    this.birthDate = '';
    this.useBillingAsDeliveryAddress = false;
    this.billingAddressId = null;
    this.billingAddress = null;
    this.deliveryAddressId = null;
    this.deliveryAddress = null;
    this.storeId = null;
    this.store = null;
  }

  userName: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  useBillingAsDeliveryAddress: boolean;
  billingAddressId: number | null;
  billingAddress: Address | null;
  deliveryAddressId: number | null;
  deliveryAddress: Address | null;
  storeId?: number | null;
  store: IStore | null;
}

export class OptionGroup extends EntityBaseNamed {
  constructor() {
    super();

    this.isMandatory = false;
    this.optionUnits = [];

    this.groupItemVisualState = new GroupItemVisualState();
  }

  isMandatory: boolean;
  optionUnits: OptionUnit[];

  /// Keeps item visual state (is not related to DTO model).
  groupItemVisualState: GroupItemVisualState;
}

export class OptionUnit extends EntityBaseNamed {
  constructor() {
    super();

    this.imageUrl = '';
    this.imageBlob = null;
    this.isMandatory = false;
    this.value = '';
    this.orderIndex = 0;
    this.optionGroupId = null;
    this.optionGroup = null;
  }

  orderIndex: number;
  value: string;
  imageUrl: string;
  /// This field is used for just added (not saved) image files. Actual saved image source is provided through `imageUrl`.
  imageBlob: any;
  isMandatory: boolean;
  optionGroupId?: number | null;
  optionGroup?: OptionGroup | null;
}

export class ModifiedOptionUnitOrder {
  constructor() {
    this.optionUnitId = 0;
    this.orderIndex = 0;
  }

  optionUnitId: number;
  orderIndex: number;
}

export class FormicReference {
  constructor(isDirtyFunc?: (isDirty: boolean) => void) {
    this.formik = null;
    this.isDirtyFunc = isDirtyFunc;
  }

  formik: any;
  isDirtyFunc?: (isDirty: boolean) => void;
}

export class ProductCategoryMapOptionGroup extends EntityBase {
  constructor() {
    super();

    this.productCategoryId = 0;
    this.optionGroupId = 0;
  }

  productCategoryId: number;
  productCategory: ProductCategory | null | undefined;

  optionGroupId: number;
  optionGroup: OptionGroup | null | undefined;
}

export class ProductCategory extends EntityBaseNamed {
  constructor() {
    super();

    this.measurements = null;
    this.optionGroupMaps = [];
    this.imageUrl = '';

    this.imageBlob = null;
  }

  imageUrl: string;
  measurements: null;
  optionGroupMaps: ProductCategoryMapOptionGroup[];

  /// This field is used for just added (not saved) image files. Actual saved image source is provided through `imageUrl`.
  imageBlob: any;
}

export class ChooseOptions {
  constructor() {
    this.category = null;
    this.categoryId = null;
    this.measurements = [];
  }
  category: ProductCategory | null;
  categoryId: number | null;
  measurements: Measurement[];
}

export class Measurement extends EntityBaseNamed {
  constructor() {
    super();
    this.measurementSizes = [];
    this.measurementMapDefinitions = [];
  }

  measurementSizes: MeasurementSize[];
  measurementMapDefinitions: measurementMapDefinitions[];
}

export class measurementMapDefinitions extends EntityBaseNamed {
  constructor() {
    super();
    this.measurementDefinition = new MeasurementDefinition();
    this.measurementDefinitionId = 0;
    this.measurementId = 0;
  }
  measurementDefinition: MeasurementDefinition;
  measurementDefinitionId: number;
  measurementId: number;
}

export class MeasurementDefinition extends EntityBaseNamed {}

export class MeasurementSize extends EntityBaseNamed {
  constructor() {
    super();
    this.values = [];
    this.measurementId = 0;
    this.measurement = null;
  }
  values: MeasurementSizeValue[];
  measurementId: number;
  measurement: any;
}

export class MeasurementSizeValue extends EntityBaseNamed {
  constructor() {
    super();
    this.values = 0;
    this.measurementDefinitionId = 0;
    this.measurementDefinition = null;
    this.measurementSizeId = 0;
    this.measurementSize = null;
  }
  values: number;
  measurementDefinitionId: number;
  measurementDefinition: any;
  measurementSizeId: number;
  measurementSize: any;
}

export class DeliveryTimeline extends EntityBase {
  constructor() {
    super();
    this.name = '';
    this.ivory = '';
    this.silver = '';
    this.black = '';
    this.gold = '';
  }
  name: string;
  ivory: string;
  silver: string;
  black: string;
  gold: string;
}
