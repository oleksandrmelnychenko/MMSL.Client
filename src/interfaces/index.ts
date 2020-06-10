import { Measurement } from './measurements';
import { EntityBase, EntityBaseNamed } from './base';
import { ProductCategory } from './products';
import { GroupItemVisualState } from './viewModels/index';
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

export class IPanelInfo {
  constructor() {
    this.isOpenPanelInfo = false;
    this.hasCloseButton = false;
    this.isHasCloseButton = true;

    this.onDismisPendingAction = () => {};
  }

  isOpenPanelInfo: boolean;
  hasCloseButton: boolean;
  componentInPanelInfo: any;
  isHasCloseButton: boolean;

  onDismisPendingAction: () => void;
}

export interface ImenuItem {
  title: string;
  className: string;
  componentType: DealerDetilsComponents;
  onClickAction?: Function;
  isSelected?: boolean;
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
    this.limit = 9999;
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
    this.isAllow = false;
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
  isAllow: boolean;
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

export class ChooseOptions {
  constructor() {
    this.category = null;
    this.measurements = [];
    this.selectedTimeline = new ProductDeliveryTimelineSelected();
  }
  category: ProductCategory | null;
  measurements: Measurement[];
  selectedTimeline: ProductDeliveryTimelineSelected;
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

export class ProductDeliveryTimeline extends EntityBase {
  constructor() {
    super();

    this.deliveryTimelines = [];
    this.deliveryTimelineId = 0;
    this.productCategoryId = 0;
  }

  deliveryTimelines: DeliveryTimeline[];
  deliveryTimelineId: number;
  productCategoryId: number;
}

export class ProductDeliveryTimelineSelected extends EntityBase {
  constructor() {
    super();

    this.deliveryTimeline = new DeliveryTimeline();
    this.deliveryTimelineId = 0;
    this.productCategoryId = 0;
  }

  deliveryTimeline: DeliveryTimeline;
  deliveryTimelineId: number;
  productCategoryId: number;
}
