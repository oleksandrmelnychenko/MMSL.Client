import { CommonDialogState } from '../redux/reducers/control.reducer';

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
  userInfo: IUserInfo;
}

export interface IPanelInfo {
  isOpenPanelInfo: boolean;
  componentInPanelInfo: any;
}

export interface IControlState {
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
  }

  isMandatory: boolean;
  optionUnits: OptionUnit[];
}

export class OptionUnit extends EntityBaseNamed {
  constructor() {
    super();

    this.imageUrl = '';
    this.isMandatory = false;
    this.value = '';
    this.orderIndex = 0;
    this.optionGroupId = null;
    this.optionGroup = null;
  }

  orderIndex: number;
  value: string;
  imageUrl: string;
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
