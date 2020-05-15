import { isCollapseMenu } from '../redux/actions/control.actions';

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

export interface IControlState {
  isCollapseMenu: boolean;
  isOpenPanelInfo: boolean;
  componentInPanelInfo: any;
}

export interface IDealer {
  dealerInfo: string;
  rejected: string;
  processing: string;
  stitching: string;
  stitched: string;
  dispatched: string;
  delivered: string;
}

export class EntityBase {
  constructor() {
    this.id = 0;
    this.isDeleted = false;
  }

  id: number;
  isDeleted: boolean;
}

export interface IStore {
  address: Address;
  addressId?: number;
  billingEmail: string;
  contactEmail: string;
  description?: string;
  id?: number;
  isDeleted?: boolean;
  isSelected?: boolean;
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
    this.limit = 30;
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
